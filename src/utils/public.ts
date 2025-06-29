import { format, addDays } from 'date-fns';
import dayjs from 'dayjs';

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

export function formatDateToShortString(dateStr: string): string {
    return dayjs(dateStr).format('ddd, MMM D');
}
