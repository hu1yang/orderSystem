import type {
    Amount,
    PriceDetail,
    PassengerType,
    PriceSummary,
    ResponseItinerary,
    Travelers,
    FQueryResult, MregeResultAirport, FQuery
} from "@/types/order.ts";
import dayjs from '@/utils/dayjs.ts';
import duration from 'dayjs/plugin/duration'
import {queryGlobalAirportsAgent} from "@/utils/request/agent.ts";
import {
    resetSearchDate,
    setCityArr,
    setFilterData,
    setFilterDataFilterTime,
    setSearchDate
} from "@/store/orderInfo.ts";
import {setErrorMsg, setSearchFlag, setSearchLoad} from "@/store/searchInfo.ts";
import type {AppDispatch} from "@/store";
import {t} from "i18next";
import Cookie from "js-cookie";
import {toLogin} from "@/utils/public.ts";

dayjs.extend(duration)

export function calculateTotalPriceSummary(
    itineraries: { amounts: Amount[] }[],
    travelers: Travelers[]
): PriceSummary {
    const passengerCountMap = travelers.reduce<Record<PassengerType, number>>((acc, t) => {
        acc[t.passengerType as PassengerType] = t.passengerCount;
        return acc;
    }, {adt: 0, chd: 0, inf: 0});

    const perType: Record<PassengerType, PriceDetail> = {
        adt: {printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.adt},
        chd: {printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.chd},
        inf: {printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.inf},
    };

    for (const itinerary of itineraries) {
        for (const amt of itinerary.amounts) {
            const type = amt.passengerType as PassengerType;
            if (!perType[type]) continue;
            perType[type].printAmount += amt.printAmount;
            perType[type].taxesAmount += amt.taxesAmount;
        }
    }

    let total = 0;

    (['adt', 'chd', 'inf'] as PassengerType[]).forEach(type => {
        const item = perType[type];
        item.printAmount = Math.round(item.printAmount * 100) / 100;
        item.taxesAmount = Math.round(item.taxesAmount * 100) / 100;
        item.unitPrice = Math.round((item.printAmount + item.taxesAmount) * 100) / 100;
        item.totalPrice = Math.round(item.unitPrice * item.count * 100) / 100;
        total += item.totalPrice;
    });

    return {
        totalPrice: Math.round(total * 100) / 100,
        perType
    };
}


export function formatTotalDuration(times: string[]): string {
    // 过滤掉空值
    const validTimes = times.filter((t): t is string => !!t && t.includes(':'))
    if (validTimes.length === 0) return '--'

    const totalMs = times.reduce((acc, timeStr) => {
        const [h, m, s] = timeStr.split(':').map(Number)
        if (isNaN(h) || isNaN(m) || isNaN(s)) return acc // 跳过非法值
        const d = dayjs.duration({hours: h, minutes: m, seconds: s})
        return acc + d.asMilliseconds()
    }, 0)

    const total = dayjs.duration(totalMs)
    const hours = Math.floor(total.asHours()) // 用 asHours 得到小数再取整
    const minutes = total.minutes()

    return `${hours}h ${minutes ? `${minutes}m` : ''}`
}

export function formatDuration(start: string, end: string): string {
    const diff = dayjs(start).diff(dayjs(end))
    const dur = dayjs.duration(diff)

    const hours = dur.hours()
    const minutes = dur.minutes()

    return `${hours}h ${minutes}m`
}


export function deduplicateByChannelCode(data: FQueryResult[]): FQueryResult[] {
    const map = new Map<string, FQueryResult>();

    for (const item of data) {
        if (!item.succeed || !item.response?.channelCode || !item.response?.updatedTime) continue;

        const key = item.response.channelCode;
        const existing = map.get(key);

        if (!existing) {
            map.set(key, item);
            continue;
        }

        const newTime = new Date(item.response.updatedTime).getTime();
        const oldTime = new Date(existing.response!.updatedTime!).getTime();

        if (newTime > oldTime) {
            map.set(key, item);
        } else if (newTime === oldTime) {
            if (existing.response!.isFromCaching && !item.response.isFromCaching) {
                map.set(key, item);
            }
        }
    }

    return Array.from(map.values());
}

// 计算amount价格
export function getAdultAmountTotal(amount: Amount): number {
    return (amount.printAmount || 0) + (amount.taxesAmount || 0);
}

// 处理初始数据结合
export const calculateAirResult = (airport: FQueryResult): MregeResultAirport[] => {

    const calculateResult = airport.response.results.flatMap(result => {
        return {
            channelCode: airport.response.channelCode,
            updatedTime: airport.response.updatedTime,
            contextId: result.contextId,
            currency: result.currency,
            patterns: result.patterns,
            resultKey: result.resultKey,
            resultType: result.resultType,
            teamedKey: result.teamedKey,
            itineraries: result.itineraries.map((itinerarie) => ({...itinerarie,segments:[...itinerarie.segments].sort((a, b) => a.sequenceNo - b.sequenceNo)})),
        }
    })
    return calculateResult
}

// 获取每段的最低价格
export function getLowestAmountsByItinerary(
    data: Map<string, ResponseItinerary[]>
) {
    const result = new Map<string, Amount[]>();

    data.forEach((itineraries,key) => {
        const groupMap = new Map<
            number,
            {
                minAmount: Amount | null;
                minTotal: number;
            }
        >();

        for (const item of itineraries) {
            const itineraryNo = item.itineraryNo;

            if (!groupMap.has(itineraryNo)) {
                groupMap.set(itineraryNo, {
                    minAmount: null,
                    minTotal: Infinity,
                });
            }

            const group = groupMap.get(itineraryNo)!;

            for (const amount of item.amounts) {
                if (amount.passengerType !== 'adt') continue;

                const total = getAdultAmountTotal(amount);

                if (total < group.minTotal) {
                    group.minTotal = total;
                    group.minAmount = amount;
                }
            }
        }

        result.set(
            key,
            Array.from(groupMap.values())
            .map(g => g.minAmount)
            .filter(Boolean) as Amount[]
        );
    });

    return result;
}

export function findLowestGroup(
    data: Map<string, Amount[]>
): Amount[] {
    let lowestAmounts: Amount[] = [];
    let lowestPrice = Infinity;

    for (const [, amounts] of data.entries()) {
        const totalPrice = amounts.reduce((sum, amount) => {
            return sum + getAdultAmountTotal(amount);
        }, 0);

        if (totalPrice < lowestPrice) {
            lowestPrice = totalPrice;
            lowestAmounts = amounts;
        }
    }

    return lowestAmounts;
}
// 单独计算最低价
export function findLowestAmount(amounts: Amount[]): Amount | null {
    if (amounts.length === 0) return null;

    return amounts.reduce((prev, curr) => {
        const prevTotal = getAdultAmountTotal(prev);
        const currTotal = getAdultAmountTotal(curr);
        return currTotal < prevTotal ? curr : prev;
    }, amounts[0]);
}

// 计算amount总价
export function amountPrice(amounts: Amount[]) {
    // 先全部转成分来累加
    const totalCents = amounts.reduce((total, item) => {
        return total + Math.round(getAdultAmountTotal(item) * 100);
    }, 0);

    // 最后再转回元并保留两位小数
    return (totalCents / 100).toFixed(2);
}

export function getAirports(data: FQueryResult[], dispatch: AppDispatch) {
    const airports = Array.from(
        new Set(
            data.flatMap(d => d.response.results.flatMap(re => re.itineraries.flatMap(it => it.segments.flatMap(segment => [
                segment.arrivalAirport,
                segment.departureAirport,
            ])))).filter(Boolean)
        )
    );
    if (airports && airports.length > 0) {
        queryAirportsAgent(airports, dispatch);
    }
}

function queryAirportsAgent(airports: string[], dispatch: AppDispatch) {
    queryGlobalAirportsAgent(airports).then(res => {
        if (res.length) {
            dispatch(setCityArr(res))
        }
    })
}

type SSEMessage = {
    event?: string
    data?: string
}

function parseSSE(
    buffer: string,
    onMessage: (msg: SSEMessage) => void
): string {
    const events = buffer.split('\n\n')

    // 最后一个可能是不完整的
    const remaining = events.pop() ?? ''

    for (const eventBlock of events) {
        if (!eventBlock.trim()) continue

        const msg: SSEMessage = {}
        const lines = eventBlock.split('\n')

        for (const line of lines) {
            if (line.startsWith('event:')) {
                msg.event = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
                msg.data = (msg.data ?? '') + line.slice(5).trim()
            }
        }

        onMessage(msg)
    }

    return remaining
}

export async function getAgentQuery(
    result: FQuery,
    dispatch: AppDispatch
) {
    dispatch(setSearchLoad(true))
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
    const token = Cookie.get('token')
    try {
        const res = await fetch(import.meta.env.VITE_AGENT_API + '/Service/StreamQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                ...result,
                cacheOnly: false
            })
        })

        if (res.status === 401) {
            interfaceError(dispatch)
            toLogin()
            return
        }

        if (!res.body) throw new Error('no stream')

        reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')

        let buffer = ''
        const allResults: FQueryResult[] = []
        let shouldStop = false
        while (!shouldStop) {
            const {value, done} = await reader.read()
            if (done) break

            buffer += decoder.decode(value, {stream: true})

            buffer = parseSSE(buffer, msg => {
                if (!msg.data) return

                if (msg.data === "<BOF>") {
                    console.log('stream')
                    dispatch(
                        setFilterDataFilterTime(result.itineraries.map(() => ({
                            departure: [0, 24],
                            arrival: [0, 24],
                        })))
                    );
                }
                if (!["<EOF>", "<BOF>"].includes(msg.data)) {
                    const data = JSON.parse(msg.data)
                    if (!data.succeed) {
                        console.error(data.errorMessage)
                        return
                    }
                    allResults.push(data)
                    const mergeAirResult = calculateAirResult(data)
                    dispatch(setSearchDate(mergeAirResult))
                }

                if (msg.data === "<EOF>") {
                    console.log('done')
                    if (!allResults.length) {
                        handleNoResult(dispatch, t('order.noSuitableData'))
                        const airports = [...new Set(
                            result.itineraries.flatMap(item => [item.arrival, item.departure])
                        )];
                        queryAirportsAgent(airports, dispatch)
                    } else {
                        getAirports(allResults, dispatch)
                        dispatch(setSearchLoad(false))
                    }
                    shouldStop = true
                }
            })
        }
        await reader.cancel()
    } catch {
        interfaceError(dispatch)
    } finally {
        console.log('Reader End')
        reader?.cancel()
    }
}

function interfaceError(dispatch: AppDispatch) {
    dispatch(setSearchLoad(false))
    dispatch(setErrorMsg(t('passenger.interfaceError')))
    dispatch(setSearchFlag(false))
}

// export async function getAgentQuery_Copy(result: FQuery, dispatch: AppDispatch) {
//     try {
//         const res = await flightQueryAgent({
//             ...result,
//             cacheOnly: false
//         });
//
//         if (!res.length) {
//             return handleNoResult(dispatch, t('order.noSuitableData'));
//         }
//
//         const objResult = deduplicateByChannelCode(res);
//         const allFailed = objResult.every(a => !a.succeed);
//
//         if (allFailed) {
//             const err = res.find(r => r.errorCode === 'C-00002');
//             return handleNoResult(dispatch, err?.errorMessage ?? t('order.noSuitableData'));
//         }
//
//         const hasResults = objResult.some(o => o.response.results && o.response.results.length);
//         if (!hasResults) {
//             return handleNoResult(dispatch, t('order.noSuitableData'));
//         }
//
//         const mergeAirResult = calculateAirResult(objResult);
//         dispatch(setSearchDate(mergeAirResult));
//
//         dispatch(
//             setFilterData({
//                 airline: [...new Set(mergeAirResult.map(i => i.channelCode))],
//                 filterTime: result.itineraries.map(() => ({
//                     departure:[0,24],
//                     arrival:[0,24],
//                 }))
//             })
//         );
//         getAirports(mergeAirResult,dispatch)
//         dispatch(setSearchLoad(false));
//     } catch {
//         dispatch(setSearchLoad(false));
//         dispatch(setErrorMsg(t('passenger.interfaceError')));
//         dispatch(setSearchFlag(false));
//     }
// }

// 🔥 单独抽出“无数据统一处理逻辑”
function handleNoResult(dispatch: AppDispatch, message: string) {
    dispatch(resetSearchDate());
    dispatch(setFilterData({airline: [], filterTime: []}));
    dispatch(setErrorMsg(message));
    dispatch(setSearchLoad(false));
}
