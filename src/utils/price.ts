import type {
    Amount,
    PriceDetail,
    PassengerType,
    PriceSummary,
    ResponseItinerary,
    Travelers, LostPriceAmout
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
        const returnItinerary = Array.from(itineraryMap.entries())
        .filter(([no]) => no !== 0)
        .map(([, it]) => it);


        if (!baseItinerary || returnItinerary.length === 0) return;

        const baseAdt = (baseItinerary.amounts || []).filter(a => a.passengerType === 'adt');
        const returnAdtOptions = returnItinerary.map(it => (it.amounts || []).filter(a => a.passengerType === 'adt'));

        if (!baseAdt.length || returnAdtOptions.some(list => list.length === 0)) return;

        // 找出 base 最低价 & 随机取
        const minBasePrice = Math.min(...baseAdt.map(getAdultAmountTotal));
        const baseOptions = baseAdt.filter(a => getAdultAmountTotal(a) === minBasePrice);
        const baseAmount = baseOptions[Math.floor(Math.random() * baseOptions.length)];

        // 找出 return 每段最低价 & 随机取（如有多个回程）
        const returnAmounts: Amount[] = [];
        for (const list of returnAdtOptions) {
            const min = Math.min(...list.map(getAdultAmountTotal));
            const minOptions = list.filter(a => getAdultAmountTotal(a) === min);
            returnAmounts.push(minOptions[Math.floor(Math.random() * minOptions.length)]);
        }

        const total = getAdultAmountTotal(baseAmount) + returnAmounts.reduce((sum, a) => sum + getAdultAmountTotal(a), 0);

        if (total < result.minTotal) {
            result = {
                minTotal: total,
                amounts: [baseAmount, ...returnAmounts],
            };
        }
    });

    return result;
}


export function applyNextCodeFilter(
    itineraries: ResponseItinerary[],
    nextCodes: string[] = []
): ResponseItinerary[] {
    return itineraries.map(it => {
        if (it.itineraryNo !== 1) return it;

        const filtered = (it.amounts || []).filter(a =>
            a.passengerType === 'adt' &&
            (nextCodes.length === 0 || nextCodes.includes(a.familyCode))
        );

        return { ...it, amounts: filtered };
    });
}




