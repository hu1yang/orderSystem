import {addDays, addMonths, differenceInCalendarDays, format, type Locale, parseISO, subDays} from 'date-fns'

import {type Dayjs} from 'dayjs';
import dayjs from '@/utils/dayjs.ts';
import type {AirlineInfo, Country, ITem, QueryGlobalAirports} from "@/types/order.ts";
import { zhCN, enUS,ru } from 'date-fns/locale'

import c6 from '@/assets/air/c6.webp'
import fz from '@/assets/air/fz.webp'
import b2 from '@/assets/air/b2.webp'
import ka from '@/assets/air/ka.webp'
import g9 from '@/assets/air/g9.webp'
import t3 from '@/assets/air/3t.webp'
import rq from '@/assets/air/rq.webp'
import sm from '@/assets/air/sm.webp'
import j9 from '@/assets/air/j9.webp'
import xy from '@/assets/air/xy.webp'
import f3 from '@/assets/air/f3.webp'
import gj from '@/assets/air/gj.webp'
import pc from '@/assets/air/pc.webp'
import fs from '@/assets/air/fs.webp'
import k9 from '@/assets/air/k9.webp'
import j4 from '@/assets/air/j4.png'

export const dayjsLocaleMap: Record<string, Locale> = {
    'zh_CN': zhCN,
    'en_US': enUS,
    'ru_RU': ru
}

export const getLocale = (localStorage.getItem('locale') || 'zh_CN')

export const localeDate  = dayjsLocaleMap[getLocale]

export const isZhCN = String(getLocale) === 'zh_CN'

export const formatLocale = (time:Date,type:string) => format(time,type,{locale:localeDate})

export function generateMonthlyDateRanges(
    numberValue: number = 1,
    isRound: boolean,
    timeValue: string | { from: string; to: string }
) {

    const today = subDays(new Date(), 1)  // 从昨天开始
    let targetDate: Date

    if (isRound && typeof timeValue === 'object') {
        // 往返：取 to，加 1 个月
        targetDate = addMonths(parseISO(timeValue.to), 1)
    } else if (!isRound && typeof timeValue === 'string') {
        // 单程：直接使用 timeValue，加 1 个月
        targetDate = addMonths(parseISO(timeValue), 1)
    } else {
        return [] // 无效输入
    }

    const daysCount = differenceInCalendarDays(targetDate, today)
    if (daysCount < 0) return []

    const ranges = []

    for (let i = 0; i <= daysCount; i++) {
        const current = addDays(today, i)

        const formatType = getLocale === 'zh_CN' ? 'MMM d' : 'd MMM'

        if (isRound) {
            const end = addDays(current, numberValue)
            const label = `${formatLocale(current, formatType)} – ${formatLocale(end, formatType)}`
            ranges.push({
                label,
                value: {
                    to: format(end, 'yyyy-MM-dd'),
                    from: format(current, 'yyyy-MM-dd'),
                },
                key: format(end, 'yyyy-MM-dd'),
            })
        } else {
            const label = formatLocale(current, formatType)
            ranges.push({
                label,
                value: format(current, 'yyyy-MM-dd'),
                key: format(current, 'yyyy-MM-dd'),
            })
        }
    }

    return ranges
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
    if(!timeStr) return null;
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
    const origin = new URL(location.origin).origin;
    window.parent.postMessage({
        type:'reloadLogOut',
    },origin)
}
export function flattenByCountry(data: QueryGlobalAirports[]) {
    const result: Country[] = [];

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

        // 查找国家
        let country = result.find(c => c.countryCode === countryCode);
        if (!country) {
            country = {
                countryCode,
                countryCName,
                countryEName,
                timeZone,
                cities: []
            };
            result.push(country);
        }

        // 查找城市
        let city = country.cities.find(c => c.cityCode === cityCode);
        if (!city) {
            city = {
                cityCode,
                cityCName,
                cityEName,
                airports: []
            };
            country.cities.push(city);
        }

        // 添加机场
        airports.forEach(airport => {
            city.airports.push({
                airportCode: airport.airportCode,
                airportCName: airport.airportCName,
                airportEName: airport.airportEName
            });
        });
    });

    return result;
}


export function filterValidTrips(data: ITem[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 清除时间部分，确保只比较日期

    return data.filter(item => {
        // 如果任意一个 departureDate 小于今天，就返回 false（删除）
        const hasPast = item.itineraries.some(itinerary => {
            const depDate = new Date(itinerary.departureDate);
            return depDate < today;
        });
        return !hasPast; // 保留没有过期的
    });
}

export function genRandomKey() {
    return 'key_' + Math.random().toString(36).slice(2, 10);
}


export const airlist: Record<string, AirlineInfo> = {
    'API-C6-V1': { picture: c6, title: 'Centrum Air' },
    'API-FZ-V1': { picture: fz, title: 'Flydubai' },
    'API-B2-V1': { picture: b2, title: 'Belarusian' },
    'API-KA-V1': { picture: ka, title: 'Aero Nomad' },
    'API-3T-V1': { picture: t3, title: 'Tarco Aviation' },
    'API-G9-V1': { picture: g9, title: 'Air Arabia' },
    'API-RQ-V1': { picture: rq, title: 'Kam Air' },
    'API-J4-V1': { picture: j4, title: 'Badr Airlines' },
    'API-SM-V1': { picture: sm, title: 'Air Cairo' },
    'API-J9-V1': { picture: j9, title: 'Jazeera' },
    'API-XY-V1': { picture: xy, title: 'Flynas' },
    'API-F3-V1': { picture: f3, title: 'Flyadeal' },
    'API-PC-V1': { picture: pc, title: 'Pegasus Airlines' },
    'API-GJ-V1': { picture: gj, title: '長龍航空' },
    'API-FS-V1': { picture: fs, title: 'FlyArystan' },
    'API-K9-V1': { picture: k9, title: 'Tez Jet Airlines' },
}

export const cabinOptions = [
    { label: 'economy', value: 'y' },
    { label: 'business', value: 'c' },
    { label: 'first', value: 'f' },
];
