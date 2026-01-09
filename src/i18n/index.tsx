import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { orderCN, orderEn, orderRU } from '@/i18n/lang/order'
import { passengerCN, passengerEn, passengerRU } from '@/i18n/lang/passenger'

const locale = localStorage.getItem('locale') || 'zh_CN'

i18n.use(initReactI18next).init({
    resources: {
        en_US: {
            translation: {
                ...orderEn,
                ...passengerEn
            }
        },
        zh_CN: {
            translation: {
                ...orderCN,
                ...passengerCN
            }
        },
        ru_RU: {
            translation: {
                ...orderRU,
                ...passengerRU
            }
        }
    },
    lng: locale,
    fallbackLng: locale,
    interpolation: {
        escapeValue: false
    }
})

export default i18n
