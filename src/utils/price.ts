import type {
    Amount,
    PriceDetail,
    PassengerType,
    PriceSummary,
    ResponseItinerary,
    Travelers, LostPriceAmout, AirChoose, ComboItem, CombinationResult
} from "@/types/order.ts";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
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
        item.printAmount = Number(item.printAmount);
        item.taxesAmount = Number(item.taxesAmount);
        item.unitPrice = (item.printAmount + item.taxesAmount);
        item.totalPrice = (item.unitPrice * item.count);
        total += item.totalPrice;
    });

    return {
        totalPrice: total,
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


export function getAdultAmountTotal(amount: Amount) {
    return (amount.printAmount || 0) + (amount.taxesAmount || 0);
}

export function findLowestAdultCombo(
    itineraryGroups: ResponseItinerary[][]
): LostPriceAmout {
    let result: LostPriceAmout = {
        minTotal: Infinity,
        amounts: [],
    };

    itineraryGroups.forEach(itineraries => {
        const itineraryMap = new Map<number, ResponseItinerary>();
        itineraries.forEach(it => itineraryMap.set(it.itineraryNo, it));

        const baseItinerary = itineraryMap.get(0);
        const returnItineraries = Array.from(itineraryMap.entries())
        .filter(([no]) => no !== 0)
        .map(([, it]) => it);

        if (!baseItinerary) return;

        const baseAdt = (baseItinerary.amounts || []).filter(a => a.passengerType === 'adt');
        if (!baseAdt.length) return;

        // 单程逻辑
        if (returnItineraries.length === 0) {
            const minBasePrice = Math.min(...baseAdt.map(getAdultAmountTotal));
            const baseOptions = baseAdt.filter(a => getAdultAmountTotal(a) === minBasePrice);
            const baseAmount = baseOptions[Math.floor(Math.random() * baseOptions.length)];

            const total = getAdultAmountTotal(baseAmount);

            if (total < result.minTotal) {
                result = {
                    minTotal: total,
                    amounts: [baseAmount],
                };
            }
            return;
        }

        for (const baseAmount of baseAdt) {

            const returnAdtOptions = returnItineraries.map(it =>
                (it.amounts || []).filter(
                    a => a.passengerType === 'adt'
                )
            );

            if (returnAdtOptions.some(list => list.length === 0)) continue;

            const returnAmounts: Amount[] = [];
            for (const list of returnAdtOptions) {
                const min = Math.min(...list.map(getAdultAmountTotal));
                const minOptions = list.filter(a => getAdultAmountTotal(a) === min);
                returnAmounts.push(minOptions[Math.floor(Math.random() * minOptions.length)]);
            }

            const total = getAdultAmountTotal(baseAmount) +
                returnAmounts.reduce((sum, a) => sum + getAdultAmountTotal(a), 0);

            if (total < result.minTotal) {
                result = {
                    minTotal: total,
                    amounts: [baseAmount, ...returnAmounts],
                };
            }
        }
    });

    return result;
}


export function applyFilter(
    itineraries: ResponseItinerary[],
): ResponseItinerary[] {
    // 检查是否存在回程段（itineraryNo > 0）
    const hasReturn = itineraries.some(it => it.itineraryNo > 0);
    if (!hasReturn) return itineraries;

    // 只过滤回程段（itineraryNo > 0）
    return itineraries.map(it => {
        if (it.itineraryNo === 0) return it;

        const filtered = (it.amounts || []).filter(a =>
            a.passengerType === 'adt'
        );

        return { ...it, amounts: filtered };
    });
}


function isSameContext(item: CombinationResult, airChoose: AirChoose): boolean {
    if (!airChoose.result) return true;
    return item.contextId === airChoose.result.contextId && item.resultKey === airChoose.result.resultKey;
}

function getFilteredAmounts(it: ResponseItinerary): Amount[] {
    const adtAmounts = (it.amounts || []).filter(a => a.passengerType === 'adt');
    return adtAmounts
}

function buildNewItineraries(
    itineraries: ResponseItinerary[],
    currentNo: number,
    amount: Amount,
    isReturn: boolean
): ResponseItinerary[] {
    return itineraries.map(i => {
        if (i.itineraryNo === currentNo) {
            return { ...i, amounts: [amount] };
        } else if (!isReturn && i.itineraryNo === 1 && currentNo === 0) {
            const nextFiltered = (i.amounts || [])
            return { ...i, amounts: nextFiltered };
        }
        return i;
    });
}

function calculateLostPrice(
    newItineraries: ResponseItinerary[],
    airChoose: AirChoose,
    isReturn: boolean
): LostPriceAmout {
    if (!isReturn) {
        // 去程组合
        return findLowestAdultCombo([newItineraries]);
    }

    let retItineraries = newItineraries;

    const chosenPrev = airChoose.result?.itineraries.find(it => it.itineraryNo === 0);

    retItineraries = retItineraries.map(it => {
        if (it.itineraryNo === 0 && chosenPrev) return chosenPrev;
        return it;
    });

    retItineraries = applyFilter(retItineraries);

    return findLowestAdultCombo([retItineraries]);
}

function flattenCombos(all: (Array<{ total: number; item: ComboItem }>)[]): ComboItem[] {
    return all.flatMap(group => group.map(g => g.item));
}

function getTopLayeredCombos(
    all: (Array<{ total: number; item: ComboItem }>)[],
    layerCount: number
): ComboItem[] {
    const top: ComboItem[] = [];
    for (let i = 0; i < layerCount; i++) {
        let min: { total: number; item: ComboItem } | null = null;
        for (const group of all) {
            const candidate = group[i];
            if (candidate && (!min || candidate.total < min.total)) {
                min = candidate;
            }
        }
        if (min) top.push(min.item);
    }
    return top;
}

export function getLayeredTopCombos(
    combinationResult: CombinationResult[],
    airportActived: number,
    airChoose: AirChoose
): ComboItem[] {
    const isReturn = airportActived === 1;
    const allLayerCombos: (Array<{ total: number; item: ComboItem }>)[] = [];

    for (const item of combinationResult) {
        if (!isSameContext(item, airChoose)) continue;

        const itinerary = item.itineraries.find(it => it.itineraryNo === airportActived);
        if (!itinerary) continue;

        const filteredAmounts = getFilteredAmounts(itinerary);
        const layerCombos: { total: number; item: ComboItem }[] = [];

        for (const amount of filteredAmounts) {
            const newItineraries = buildNewItineraries(item.itineraries, itinerary.itineraryNo, amount, isReturn);
            const lostPrice = calculateLostPrice(newItineraries, airChoose, isReturn);
            const total = lostPrice.minTotal;

            layerCombos.push({
                total,
                item: {
                    amount,
                    itineraryNo: itinerary.itineraryNo,
                    familyCode: amount.familyCode,
                    lostPrice,
                    channelCode: item.channelCode,
                    resultKey: item.resultKey,
                    currency: item.currency,
                    sourceItem: {
                        ...item,
                        itineraries: newItineraries
                    }
                }
            });
        }

        allLayerCombos.push(layerCombos.sort((a, b) => a.total - b.total).slice(0, 4));
    }

    return isReturn ? flattenCombos(allLayerCombos) : getTopLayeredCombos(allLayerCombos, 4);
}
