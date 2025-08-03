import {format, addDays, parseISO, differenceInCalendarDays, addMonths} from 'date-fns';
import dayjs, {type Dayjs} from 'dayjs';
import type {QueryGlobalAirports} from "@/types/order.ts";

export function generateMonthlyDateRanges(
    numberValue: number = 1,
    isRound: boolean,
    timeValue: string | { from: string; to: string }
) {
    const today = new Date();
    let targetDate: Date;

    if (isRound && typeof timeValue === 'object') {
        // 往返：取 from，加 1 个月
        targetDate = addMonths(parseISO(timeValue.to), 1);
    } else if (!isRound && typeof timeValue === 'string') {
        // 单程：直接使用 timeValue，加 1 个月
        targetDate = addMonths(parseISO(timeValue), 1);
    } else {
        return []; // 无效输入
    }

    const daysCount = differenceInCalendarDays(targetDate, today);
    if (daysCount < 0) return [];

    const ranges = [];

    for (let i = 0; i <= daysCount; i++) {
        const current = addDays(today, i);

        if (isRound) {
            const end = addDays(current, numberValue);
            const label = `${format(current, 'MMM d')} – ${format(end, 'MMM d')}`;
            ranges.push({
                label,
                value: {
                    to: format(end, 'yyyy-MM-dd'),
                    from: format(current, 'yyyy-MM-dd'),
                },
                key: format(end, 'yyyy-MM-dd'),
            });
        } else {
            const label = format(current, 'MMM d');
            ranges.push({
                label,
                value: format(current, 'yyyy-MM-dd'),
                key: format(current, 'yyyy-MM-dd'),
            });
        }
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

