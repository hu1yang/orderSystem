import {useMemo} from "react";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {cabinOptions} from "@/utils/public.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useTranslation} from "react-i18next";

import styles from "./styles.module.less";

const AirTooltip = () => {
    const {t} = useTranslation();

    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const canbinLabel = useMemo(() => {
        const cabinOption = cabinOptions.find(op => op.value === query.cabinLevel)
        return t(`order.${cabinOption?.label}`) ?? t('order.economy')
    }, [query]);

    return (
        <div className={styles.airTooltipContent}>
            <div className={styles.moreInfo}>
                <div className={styles.moreTitle}>{canbinLabel}</div>
                <div className={styles.moreIcon}>
                    <div className={`${styles.moreIconLi} s-flex ai-ct`}>
                        <RestaurantIcon />
                        <span>{t('order.mealsTips')}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AirTooltip
