import { format, addDays } from 'date-fns';
import dayjs, {type Dayjs} from 'dayjs';
import type {QueryGlobalAirports} from "@/types/order.ts";

export function generateMonthlyDateRanges() {
    const today = new Date();
    const ranges = [];

    for (let i = 0; i < 30; i++) {
        const start = addDays(today, i);
        const end = addDays(start, 2); // 区间是 2 天
        const label = `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
        ranges.push({ label,price:'' });
    }

    return ranges;
}

// 参数规范化：空字符串转为 null（递归处理嵌套对象）
export function normalizeParams<T>(params?: T): T {
    if (!params || typeof params !== 'object') return params as T

    const result: any = Array.isArray(params) ? [] : {}
    for (const key in params) {
        const value = (params as any)[key]
        result[key] =
            value === ''
                ? null
                : typeof value === 'object'
                    ? normalizeParams(value)
                    : value
    }
    return result
}

// date获取时间
export function extractTimeWithTimezone(datetimeStr:string) {
    const date = new Date(datetimeStr);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function formatFlyingTime(timeStr:string) {
    const [hours, minutes] = timeStr.split(':');
    return `${parseInt(hours)}h ${parseInt(minutes)}m`;
}

export function formatDateToShortString(dateStr: string|Dayjs): string {
    return dayjs(dateStr).format('ddd, MMM D');
}

// 防抖
export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}


export function toLogin () {
    window.location.href = `https://www.orientalsky.speedpower.net.cn/manage/agent/login?redirect=${encodeURIComponent(window.location.href)}`;
}
export function flattenByCountry(data:QueryGlobalAirports[]) {
    const map = new Map();

    data.forEach(item => {
        const {
            countryCode,
            countryCName,
            countryEName,
            timeZone,
            cityCode,
            cityCName,
            cityEName,
            airports
        } = item;

        if (!map.has(countryCode)) {
            map.set(countryCode, {
                countryCode,
                countryCName,
                countryEName,
                timeZone,
                airports: []
            });
        }

        const country = map.get(countryCode);

        airports.forEach(airport => {
            country.airports.push({
                cityCode,
                cityCName,
                cityEName,
                airportCode: airport.airportCode,
                airportCName: airport.airportCName,
                airportEName: airport.airportEName
            });
        });
    });

    return Array.from(map.values());
}

