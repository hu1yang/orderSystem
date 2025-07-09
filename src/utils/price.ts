import type {
    Amount,
    PriceDetail,
    PassengerType,
    PriceSum, PriceSummary,
    ResponseItinerary,
    Travelers
} from "@/types/order.ts";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export function groupAmountByFamilyCodeFnc(amounts: Amount[], travelers: Travelers[]) {
    const groupMap = new Map<string, number>();

    for (const amt of amounts) {
        const traveler = travelers.find(t => t.passengerType === amt.passengerType);
        if (!traveler || traveler.passengerCount === 0) continue;

        const total = (amt.printAmount + amt.taxesAmount) * traveler.passengerCount;
        groupMap.set(amt.familyCode, (groupMap.get(amt.familyCode) || 0) + total);
    }

    return Array.from(groupMap.values()).map(val => Math.ceil(val * 100) / 100);
}

export function getTotalPriceByFamilyCode(
    familyCode: string,
    allAmounts: Amount[],
    travelers: Travelers[]
): number {
    const total = allAmounts
    .filter(a => a.familyCode === familyCode)
    .reduce((sum, amt) => {
        const traveler = travelers.find(t => t.passengerType === amt.passengerType);
        const count = traveler?.passengerCount || 0;
        return sum + (amt.printAmount + amt.taxesAmount) * count;
    }, 0);

    return Math.ceil(total * 100) / 100;
}

export function sumAmountsByPassengerType(itineraries: ResponseItinerary[]) {
    const result: Record<string, PriceSum> = {};

    for (const itinerary of itineraries) {
        for (const amt of itinerary.amounts) {
            const type = amt.passengerType;
            if (!result[type]) {
                result[type] = { printAmount: 0, taxesAmount: 0 };
            }

            result[type].printAmount += amt.printAmount;
            result[type].taxesAmount += amt.taxesAmount;
        }
    }

    // 保留两位小数并向上进一
    for (const type in result) {
        const val = result[type];
        val.printAmount = Math.ceil(val.printAmount * 100) / 100;
        val.taxesAmount = Math.ceil(val.taxesAmount * 100) / 100;
    }

    return result;
}

function ceil2(value: number): number {
    return Math.ceil(value * 100) / 100;
}

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
        item.printAmount = ceil2(item.printAmount);
        item.taxesAmount = ceil2(item.taxesAmount);
        item.unitPrice = ceil2(item.printAmount + item.taxesAmount);
        item.totalPrice = ceil2(item.unitPrice * item.count);
        total += item.totalPrice;
    });

    return {
        totalPrice: ceil2(total),
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
