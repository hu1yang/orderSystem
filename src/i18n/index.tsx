import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { orderCN, orderEn, orderRU } from '@/i18n/lang/order'
import { passengerCN, passengerEn, passengerRU } from '@/i18n/lang/passenger'
import { commonCn, commonEn, commonRu } from '@/i18n/lang/common.ts'
import {getLocale as locale} from "@/utils/public.ts";

i18n.use(initReactI18next).init({
    resources: {
        en_US: {
            translation: {
                ...orderEn,
                ...passengerEn,
                ...commonEn
            }
        },
        zh_CN: {
            translation: {
                ...orderCN,
                ...passengerCN,
                ...commonCn
            }
        },
        ru_RU: {
            translation: {
                ...orderRU,
                ...passengerRU,
                ...commonRu
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
