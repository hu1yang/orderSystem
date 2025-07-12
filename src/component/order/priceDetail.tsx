import { memo, useCallback } from "react";
import type { Amount } from "@/types/order.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import styles from "@/component/order/styles.module.less";
import { Divider } from "@mui/material";

const passengerTypes = {
    adt: 'Adult',
    chd: 'Child',
    inf: 'Infant',
} as const;

const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const;

const PriceDetail = memo(({ amounts, currency, totalPrice }: {
    amounts: Amount[];
    currency: string;
    totalPrice: number|string
}) => {
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType);

    const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }, []);

    return (
        <div className={styles.priceDetail} onMouseDown={stopPropagation}>
            <div className={styles.priceAbout}>
                {amounts.map((amount: Amount,amountIndex) => (
                    <div key={`${amount.passengerType}-${amountIndex}`}>
                        <div className={`${styles.priceTitle} s-flex ai-ct jc-fe`}>
                            <div className={styles.priceFlight}>{currency}${amount.printAmount + amount.taxesAmount}</div>
                            <p>/{passengerTypes[amount.passengerType]}</p>
                        </div>
                        <div className={`${styles.priceTips} s-flex jc-fe`}>
                            Avg. {itineraryTypeMap[itineraryType]} price per passenger
                        </div>
                        <div className={styles.details}>
                            <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                                <span>{passengerTypes[amount.passengerType]} Ticket</span>
                                <span>{currency}${amount.printAmount + amount.taxesAmount} × 1</span>
                            </div>
                            <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                <span>Fare</span>
                                <span>{currency}${amount.printAmount} × 1</span>
                            </div>
                            <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                <span>Taxes & fees</span>
                                <span>{currency}${amount.taxesAmount} × 1</span>
                            </div>
                        </div>
                        <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />
                    </div>
                ))}

                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                    <span>Current Total</span>
                    <span>{currency}${totalPrice}</span>
                </div>
            </div>
        </div>
    );
});

export default PriceDetail;
