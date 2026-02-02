import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'
import {resolveLocale} from "@/utils/local.ts";

const dayjsLocaleMap: Record<string, string> = {
    zh_CN: 'zh-cn',
    en_US: 'en',
    ru_RU: 'ru'
}
const locale = resolveLocale()

dayjs.locale(dayjsLocaleMap[locale] || 'zh-cn')

export default dayjs


