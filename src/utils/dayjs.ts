import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ru'

const dayjsLocaleMap: Record<string, string> = {
    zh_CN: 'zh-cn',
    en_US: 'en',
    ru_RU: 'ru'
}
const locale = localStorage.getItem('locale') || 'zh_CN'

dayjs.locale(dayjsLocaleMap[locale] || 'zh-cn')

export default dayjs


