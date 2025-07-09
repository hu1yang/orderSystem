import { memo, useCallback, useMemo } from "react";
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

const PriceDetail = memo(({ amounts, familyName, currency }: {
    amounts: Amount[];
    familyName: string;
    currency: string;
}) => {
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType);
    const travelers = useSelector((state: RootState) => state.ordersInfo.query.travelers);

    const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }, []);

    const findPassengerCount = (passengerType: string) =>
        travelers.find(traveler => traveler.passengerType === passengerType)?.passengerCount || 0;

    const currentAmounts = useMemo(() => {
        return amounts.filter((amount: Amount) => amount.familyName === familyName);
    }, [amounts, familyName]);

    // 计算每项乘客的总价（含税）
    const amountTotal = (amount: Amount) => {
        const count = findPassengerCount(amount.passengerType);
        return (amount.printAmount + amount.taxesAmount) * count;
    };

    // 计算所有乘客类型的总价总和
    const totalPrice = useMemo(() => {
        return currentAmounts.reduce((total, amount) => {
            return total + amountTotal(amount);
        }, 0);
    }, [currentAmounts, travelers]);

    return (
        <div className={styles.priceDetail} onMouseDown={stopPropagation}>
            <div className={styles.priceAbout}>
                {currentAmounts.map((amount: Amount) => {
                    const count = findPassengerCount(amount.passengerType);
                    const singleTotal = amount.printAmount + amount.taxesAmount;

                    return (
                        <div key={amount.passengerType}>
                            <div className={`${styles.priceTitle} s-flex ai-ct jc-fe`}>
                                <div className={styles.priceFlight}>{currency}${amountTotal(amount)}</div>
                                <p>/{passengerTypes[amount.passengerType]}</p>
                            </div>
                            <div className={`${styles.priceTips} s-flex jc-fe`}>
                                Avg. {itineraryTypeMap[itineraryType]} price per passenger
                            </div>
                            <div className={styles.details}>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                                    <span>{passengerTypes[amount.passengerType]} Ticket</span>
                                    <span>{currency}${singleTotal} × {count}</span>
                                </div>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                    <span>Fare</span>
                                    <span>{currency}${amount.printAmount} × {count}</span>
                                </div>
                                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                                    <span>Taxes & fees</span>
                                    <span>{currency}${amount.taxesAmount} × {count}</span>
                                </div>
                            </div>
                            <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />
                        </div>
                    );
                })}

                <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                    <span>Current Total</span>
                    <span>{currency}${totalPrice}</span>
                </div>
            </div>
        </div>
    );
});

export default PriceDetail;
