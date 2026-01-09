import {memo, useMemo} from "react";
import type { Amount } from "@/types/order.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import styles from "@/component/order/styles.module.less";
import { Divider } from "@mui/material";
import {getAdultAmountTotal} from "@/utils/order.ts";
import {useTranslation} from "react-i18next";

const passengerTypes = {
    adt: 'Adult',
    chd: 'Child',
    inf: 'Infant',
} as const;


const PriceDetail = memo(({ amounts, currency, totalPrice }: {
    amounts: Amount[];
    currency: string;
    totalPrice: number|string
}) => {
    const {t} = useTranslation()

    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType);

    const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const totals = useMemo(() =>
            amounts.map(a => Math.round(getAdultAmountTotal(a) * 100) / 100),
        [amounts]
    )

    return (
        <div className={styles.priceDetail} onMouseDown={stopPropagation}>
            <div className={styles.priceAbout}>
                {
                    amounts.map((amount: Amount,amountIndex) => (
                        <div key={`${amount.passengerType}-${amountIndex}`}>
                            <div className={`${styles.priceTitle} s-flex ai-ct jc-fe`}>
                                <div className={styles.priceFlight}>{currency}${totals[amountIndex]}</div>
                                <p>/{t(`order.${passengerTypes[amount.passengerType]}`)}</p>
                            </div>
                            <div className={`${styles.priceTips} s-flex jc-fe`}>
                                {t('order.avgTips',{type:t(`order.${itineraryType}`)})}
                            </div>
                            <div className={styles.details}>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                                    <span>{t(`order.${passengerTypes[amount.passengerType]}`)} {t(`order.tickets`)}</span>
                                    <span>{currency}${totals[amountIndex]} × 1</span>
                                </div>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                    <span>{t(`passenger.Fare`)}</span>
                                    <span>{currency}${amount.printAmount} × 1</span>
                                </div>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                    <span>{t(`passenger.taxesFees`)}</span>
                                    <span>{currency}${amount.taxesAmount} × 1</span>
                                </div>
                            </div>
                            <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />
                        </div>
                    ))
                }
                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                    <span>{t(`order.currentTotal`)}</span>
                    <span>{currency}${totalPrice}</span>
                </div>
            </div>
        </div>
    );
});

export default PriceDetail;
