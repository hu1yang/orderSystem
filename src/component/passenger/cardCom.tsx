import {memo, useMemo, useState} from "react";
import { useSelector } from "react-redux";
import {Card, CardActions, CardContent, CardHeader, Divider, Typography} from "@mui/material";

import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import styles from './styles.module.less'
import type { RootState } from "@/store";
import type {PriceSummary} from "@/types/order.ts";

const passengerTypes = {
    adt: 'Adult',
    chd: 'Child',
    inf: 'Infant',
} as const;

const CardCom = memo(({pirceResult}:{
    pirceResult: PriceSummary
}) => {
    const resultAir = useSelector((state: RootState) => state.ordersInfo.airChoose.result)

    const buggaegs = useMemo(() => {
        if(!resultAir) return []
        return resultAir.itineraries.map(it => it.amounts.filter(am => am.luggages.length))
    }, []);

    const [priceHide, setPriceHide] = useState(false)

    const setPirce = () => {
        setPriceHide(!priceHide)
    }

    return (
        <Card sx={{minWidth: 'var(--price-card-width)', boxShadow: '0 4px 16px 0 rgba(69,88,115,.2)'}}>
            <CardHeader title={
                <div onClick={setPirce} className={'cursor-p s-flex ai-ct'}>
                    <span>Price Details</span>
                    <ExpandMoreIcon sx={{
                        transition: 'transform .2s ease-in-out',
                        transform: !priceHide ? 'rotate(0deg)' : 'rotate(180deg)',
                        fontSize: '2rem'
                    }}/>
                </div>
            } sx={{
                px: 2,
                '.MuiTypography-root': {
                    color: 'var(--text-color)',
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            }}/>
            <CardContent sx={{
                pt: 0,
                px: 2
            }}>
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    {
                        resultAir?.itineraries[0].amounts.map((amount,amountIndex) => (
                            <div className={styles.priceCom} key={`${amount.familyName}-${amount.familyCode}-${amountIndex}`}>
                                <div key={`${amount.familyName}-${amount.familyCode}-c1`} className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                                    <div className={`${styles.labels} s-flex ai-ct`}>
                                        <span>Tickets({pirceResult.perType[amount.passengerType].count} {passengerTypes[amount.passengerType]})</span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{resultAir.currency}${pirceResult.perType[amount.passengerType].totalPrice}</span>
                                    </div>
                                </div>
                                <div key={`${amount.familyName}-${amount.familyCode}-c2`} className={`${styles.priceHeight} full-width`}
                                     style={{maxHeight: !priceHide ? '0px' : '1000px'}}>
                                    <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                                        <div className={`${styles.labels} s-flex ai-ct`}>
                                            <span>{passengerTypes[amount.passengerType]}s (Passenger {pirceResult.perType[amount.passengerType].count})</span>
                                        </div>
                                        <div className={styles.values}>
                                            <span>{resultAir.currency}${pirceResult.perType[amount.passengerType].unitPrice} × {pirceResult.perType[amount.passengerType].count}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                                        <div className={`${styles.labels} s-flex ai-ct`}>
                                            <span style={{fontSize: 12}}>Fare</span>
                                        </div>
                                        <div className={styles.values}>
                                            <span style={{fontSize: 12}}>{resultAir.currency}${pirceResult.perType[amount.passengerType].printAmount} × {pirceResult.perType[amount.passengerType].count}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                                        <div className={`${styles.labels} s-flex ai-ct`}>
                                            <span style={{fontSize: 12}}>Taxes & fees</span>
                                        </div>
                                        <div className={styles.values}>
                                            <span style={{fontSize: 12}}>{resultAir.currency}${pirceResult.perType[amount.passengerType].taxesAmount} × {pirceResult.perType[amount.passengerType].count}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
                {
                    buggaegs.map((buggaeg,buggaegIndex) => (
                        <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`} key={buggaegIndex}>
                            <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span>Baggage-{buggaegIndex + 1}</span>
                                </div>

                            </div>
                            <div className={`${styles.priceHeight} ${styles.baggage} full-width`}>
                                {
                                    buggaeg.map(amount => (
                                        amount.luggages.map((luggage,luggageIndex) => (
                                            <div className={`${styles.priceli} s-flex ai-ct jc-bt`} key={`${amount.familyCode}-${luggageIndex}`}>
                                                <HtmlTooltip placement={'top'} sx={{
                                                    p: 0,
                                                    '.MuiTooltip-tooltip': {
                                                        maxWidth: 600, // 或设置固定宽度 width: 300
                                                    },
                                                }} title={
                                                    <>
                                                        <Typography fontSize={14} color={'var(--text-color)'}>({amount.passengerType})Free baggage
                                                            allowance: <strong
                                                                style={{color: 'var(--text-color)', fontSize: 14, fontWeight: 'bold'}}>{luggage.luggageCount}
                                                                {luggage.luggageSizeType}</strong> per passenger</Typography>
                                                    </>

                                                }>
                                                    <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                                        <span style={{fontSize: 12}}>{amount.familyName}: {luggage.luggageType} baggage</span>
                                                    </div>
                                                </HtmlTooltip>
                                                <div className={styles.values}>
                                                    <span style={{fontSize: 12, color: '#06aebd'}}>Free</span>
                                                </div>
                                            </div>
                                        ))
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }

                <Divider
                    sx={{
                        borderTopStyle: 'dashed',
                        borderTopWidth: '1px',
                        borderColor: 'var(--put-border-color)',
                        borderBottomStyle: 'inherit',
                        mt: 2
                    }}
                />
            </CardContent>
            <CardActions sx={{
                px: 2,
                pb: 3
            }}>
                <div className={`s-flex flex-dir jc-fe ai-fe full-width`}>
                    <div className={`${styles.priceLine} s-flex jc-bt ai-ct full-width`}>
                        <div className={styles.labels}>Total</div>
                        <div className={styles.prices}>{resultAir?.currency}${pirceResult.totalPrice}</div>
                    </div>
                </div>
            </CardActions>
        </Card>
    )
})

export default CardCom
