import type {
    Amount,
    PriceDetail,
    PassengerType,
    PriceSummary,
    ResponseItinerary,
    Travelers,
    FQueryResult, ItinerariesMerge, IamountsMerge, MregeResultAirport, FQuery
} from "@/types/order.ts";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
import {getAuthorizableRoutingGroupAgent} from "@/utils/request/agent.ts";
import {setNoData, setSearchDate} from "@/store/orderInfo.ts";
import {setErrorMsg, setSearchFlag, setSearchLoad} from "@/store/searchInfo.ts";
import type {AppDispatch} from "@/store";
dayjs.extend(duration)

export function calculateTotalPriceSummary(
    itineraries: { amounts: Amount[] }[],
    travelers: Travelers[]
): PriceSummary {
    const passengerCountMap = travelers.reduce<Record<PassengerType, number>>((acc, t) => {
        acc[t.passengerType as PassengerType] = t.passengerCount;
        return acc;
    }, { adt: 0, chd: 0, inf: 0 });

    const perType: Record<PassengerType, PriceDetail> = {
        adt: { printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.adt },
        chd: { printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.chd },
        inf: { printAmount: 0, taxesAmount: 0, unitPrice: 0, totalPrice: 0, count: passengerCountMap.inf },
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

    const totalMs = times.reduce((acc, timeStr) => {
        const [h, m, s] = timeStr.split(':').map(Number)
        if (isNaN(h) || isNaN(m) || isNaN(s)) return acc // 跳过非法值
        const d = dayjs.duration({ hours: h, minutes: m, seconds: s })
        return acc + d.asMilliseconds()
    }, 0)

    const total = dayjs.duration(totalMs)
    const hours = Math.floor(total.asHours()) // 用 asHours 得到小数再取整
    const minutes = total.minutes()

    return `${hours}h ${minutes}m`
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
export const calculateAirResult = (airports:FQueryResult[]): MregeResultAirport[] => {
    const calculateResult = airports.flatMap(airport => airport.response.results.flatMap(result => {
        const mergeItinerariesResult = mergeItineraries(result.itineraries)
        return {
            channelCode:airport.response.channelCode,
            contextId:result.contextId,
            currency:result.currency,
            patterns:result.patterns,
            resultKey:result.resultKey,
            resultType:result.resultType,
            teamedKey:result.teamedKey,
            itinerariesMerge:mergeItinerariesResult
        }
    }))
    return calculateResult
}
// 合并itineraries数据
function mergeItineraries(data: ResponseItinerary[]): ItinerariesMerge[] {
    // 按 itineraryNo 分组
    const grouped = data.reduce<Record<number, ResponseItinerary[]>>((acc, cur) => {
        acc[cur.itineraryNo] = acc[cur.itineraryNo] || [];
        acc[cur.itineraryNo].push(cur);
        return acc;
    }, {});

    const result: ItinerariesMerge[] = [];

    Object.entries(grouped).forEach(([noStr, items]) => {
        const itineraryNo = Number(noStr);

        // 按 segments 分组
        const segmentMap: Record<string, ResponseItinerary[]> = {};
        items.forEach(item => {
            const segKey = item.segments
                .slice() // 防止改动原数组
                .sort((a, b) => a.sequenceNo - b.sequenceNo)
                .map(seg => seg.flightNumber).join('|');
            if (!segmentMap[segKey]) {
                segmentMap[segKey] = [];
            }
            segmentMap[segKey].push(item);
        });

        // 遍历每组相同 segments
        Object.entries(segmentMap).forEach(([, list]) => {
            // 每个行程的 amounts 按价格升序排序
            const sortedAmountsList = list.map(it => ({
                itineraryKey: it.itineraryKey,
                amounts: [...it.amounts].sort(
                    (a, b) =>
                        (a.printAmount + a.taxesAmount) -
                        (b.printAmount + b.taxesAmount)
                )
            }));

            // 逐个位置比对取最低价
            const mergedAmounts: IamountsMerge[] = [
                {
                    itineraryKey: '',
                    amounts: []
                }
            ];

            const maxLen = Math.max(...sortedAmountsList.map(sa => sa.amounts.length));
            for (let i = 0; i < maxLen; i++) {
                let cheapest: number | null = null;
                let chosenKey = '';
                let chosenAmount: Amount | null = null;

                sortedAmountsList.forEach(sa => {
                    const amt = sa.amounts[i];
                    if (amt) {
                        const price = amt.printAmount + amt.taxesAmount;
                        if (cheapest === null || price < cheapest) {
                            cheapest = price;
                            chosenKey = sa.itineraryKey;
                            chosenAmount = amt;
                        }
                    }
                });

                if (chosenAmount) {
                    // 如果 amountsMerge 还没有该 itineraryKey，就加一项
                    let mergeItem = mergedAmounts.find(m => m.itineraryKey === chosenKey);
                    if (!mergeItem) {
                        mergeItem = { itineraryKey: chosenKey, amounts: [] };
                        mergedAmounts.push(mergeItem);
                    }
                    mergeItem.amounts.push(chosenAmount);
                }
            }

            result.push({
                segments: list[0].segments,
                itineraryNo,
                amountsMerge: mergedAmounts.filter(m => m.itineraryKey) // 过滤掉空的
            });
        });
    });

    return result;
}

// 获取每段的最低价格
export function getLowestAmountsByItinerary(data: ItinerariesMerge[]) {
    // 按 itineraryNo 分组
    const groupMap = new Map<number, Amount[]>();

    data.forEach(item => {
        const list: Amount[] = [];
        item.amountsMerge.forEach(am => {
            am.amounts.forEach(amount => {
                if(amount.passengerType === 'adt'){
                    list.push(amount);
                }
            });
        });

        if (groupMap.has(item.itineraryNo)) {
            groupMap.get(item.itineraryNo)!.push(...list);
        } else {
            groupMap.set(item.itineraryNo, list);
        }
    });
    // 找出每组的最低价
    const result = Array.from(groupMap.entries()).map(([, amounts]) => {
        return findLowestAmount(amounts)
    });

    return result;
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


export function getAgentQuery(result:FQuery,dispatch:AppDispatch){
    getAuthorizableRoutingGroupAgent(result).then(res => {
        if(res.length){
            const objResult = deduplicateByChannelCode(res)
            if(objResult.some(objresult => objresult.response.results && objresult.response.results.length)){
                const mergeAirResult = calculateAirResult(objResult)
                dispatch(setSearchDate(mergeAirResult))
            }else{
                dispatch(setSearchDate([]))
                dispatch(setNoData(true))
            }
            const allFailed = objResult.every(a => a.succeed !== true)
            dispatch(setSearchLoad(false))

            if(allFailed){
                const resultError = res.find(sc => sc.errorCode === 'C-00002')
                if(resultError){
                    dispatch(setSearchDate([]))
                    dispatch(setNoData(true))
                    dispatch(setErrorMsg(resultError.errorMessage))
                    return
                }
                dispatch(setSearchDate([]))
                dispatch(setNoData(true))
                dispatch(setErrorMsg('No suitable data'))
            }
        }else{
            dispatch(setSearchLoad(false))
            dispatch(setNoData(true))
            dispatch(setErrorMsg('No suitable data'))
        }
    }).catch(() => {
        dispatch(setSearchLoad(false))
        dispatch(setErrorMsg('Interface error'))
        dispatch(setSearchFlag(false))
    })
}
