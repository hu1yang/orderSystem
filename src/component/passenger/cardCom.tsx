import { memo, useState} from "react";
import { useSelector } from "react-redux";
import {Avatar, Card, CardActions, CardContent, CardHeader, Chip, Divider, Typography} from "@mui/material";

import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import T from '@/assets/t.png'
import C from '@/assets/c.png'
import styles from './styles.module.less'
import type { RootState } from "@/store";
import CheckIcon from "@mui/icons-material/Check";
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


    const [chipHide, setChipHide] = useState(false)
    const [priceHide, setPriceHide] = useState(false)

    const setChip = () => {
        setChipHide(!chipHide)
    }
    const setPirce = () => {
        setPriceHide(!priceHide)
    }

    return (
        <Card sx={{minWidth: 376, boxShadow: '0 4px 16px 0 rgba(69,88,115,.2)'}}>
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
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                        <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                            <span>Baggage</span>
                        </div>

                    </div>
                    <div className={`${styles.priceHeight} ${styles.baggage} full-width`}>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0
                            }} title={
                                <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                    Click to view baggage allowance details
                                </Typography>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Personal item</span>
                                </div>
                            </HtmlTooltip>

                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>Check with airline</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '.MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage
                                        allowance: <strong
                                            style={{color: 'var(--text-color)', fontSize: 14, fontWeight: 'bold'}}>20
                                            kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>

                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Carry-on baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12, color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '.MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage
                                        allowance: <strong
                                            style={{color: 'var(--text-color)', fontSize: 14, fontWeight: 'bold'}}>20
                                            kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Checked baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12, color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
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
                    {/*<HtmlTooltip sx={{*/}
                    {/*    '.MuiTooltip-tooltip': {*/}
                    {/*        maxWidth: 400*/}
                    {/*    }*/}
                    {/*}} title={*/}
                    {/*    <div className={styles.tripBox}>*/}
                    {/*        <div className={styles.tripTitle}>Start Earning Trip Coins</div>*/}
                    {/*        <Chip label="100 Trip Coins = US$1" size="medium" avatar={<Avatar src={T} sx={{*/}
                    {/*            width: '18px !important',*/}
                    {/*            height: '18px !important',*/}
                    {/*        }}/>} sx={{*/}
                    {/*            height: '25px',*/}
                    {/*            borderRadius: '2px',*/}
                    {/*            borderColor: 'rgba(255,111,0,.32)',*/}
                    {/*            background: '#f5f7fa',*/}
                    {/*            mt: '8px',*/}
                    {/*            '.MuiChip-label': {*/}
                    {/*                color: 'var(--text-color)'*/}
                    {/*            }*/}
                    {/*        }}/>*/}
                    {/*        <div className={`${styles.tripBoxFor} s-flex flex-dir ai-fs`}>*/}
                    {/*            <div className={styles.tripBoxTitles}>*/}
                    {/*                For this trip*/}
                    {/*            </div>*/}
                    {/*            <div className={`${styles.tripBoxContent} s-flex`}>*/}
                    {/*                <CheckIcon sx={{*/}
                    {/*                    fontSize: 14,*/}
                    {/*                    color: 'var(--keynote-text)',*/}
                    {/*                    mt: '5px'*/}
                    {/*                }}/>*/}
                    {/*                <div className={`s-flex flex-dir`} style={{textAlign: 'left'}}>*/}
                    {/*                    <div className={styles.tripBoxContentText}>You'll earn Trip Coins*/}
                    {/*                        worth <strong> 0.25%</strong> of the booking total after your trip!*/}
                    {/*                    </div>*/}
                    {/*                    <div className={`${styles.tripBoxMore} s-flex ai-ct cursor-p`}*/}
                    {/*                         onClick={setChip}>*/}
                    {/*                        <div className={styles.tripBoxMoreText}>*/}
                    {/*                            Details*/}
                    {/*                        </div>*/}
                    {/*                        <ExpandMoreIcon sx={{*/}
                    {/*                            fontSize: 20,*/}
                    {/*                            color: 'var(--active-color)',*/}
                    {/*                            transition: 'transform .2s ease-in-out',*/}
                    {/*                            transform: chipHide ? 'rotate(0deg)' : 'rotate(180deg)',*/}
                    {/*                        }}/>*/}
                    {/*                    </div>*/}
                    {/*                    {*/}
                    {/*                        chipHide && <Chip avatar={<Avatar src={C} sx={{*/}
                    {/*                            width: '18px !important',*/}
                    {/*                            height: '18px !important',*/}
                    {/*                        }}/>} variant="outlined" sx={{*/}
                    {/*                            borderRadius: '2px',*/}
                    {/*                            background: 'var(--vt-c-white)'*/}
                    {/*                        }} label={*/}
                    {/*                            <div className={`${styles.tripBoxMoreBox} s-flex ai-ct`}>*/}
                    {/*                                <div className={styles.ratio}>+10%</div>*/}
                    {/*                                <span>Become a gold member and earn 10% more</span>*/}
                    {/*                            </div>*/}
                    {/*                        }/>*/}
                    {/*                    }*/}

                    {/*                </div>*/}

                    {/*            </div>*/}

                    {/*        </div>*/}
                    {/*        <div className={styles.tripBoxEarn}>*/}
                    {/*            <div className={styles.tripBoxTitles}>*/}
                    {/*                How to Earn Trip Coins*/}
                    {/*            </div>*/}
                    {/*            <div className={`${styles.tripBoxContent} s-flex`}>*/}

                    {/*                <div className={styles.tripBoxContentText}>*/}
                    {/*                    You'll earn Trip Coins each time you book with us. Trip Coins can be used to*/}
                    {/*                    save on future bookings.*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*}>*/}
                    {/*    <Chip label="Trip Coins + 111" size="medium" avatar={<Avatar src={T} sx={{*/}
                    {/*        width: '18px !important',*/}
                    {/*        height: '18px !important',*/}
                    {/*    }}/>} variant="outlined" sx={{*/}
                    {/*        height: '25px',*/}
                    {/*        borderRadius: '2px',*/}
                    {/*        borderColor: 'rgba(255,111,0,.32)',*/}
                    {/*        background: 'rgba(255,111,0,.08)',*/}
                    {/*        mt: 1,*/}
                    {/*        '.MuiChip-label': {*/}
                    {/*            color: '#eb5600'*/}
                    {/*        }*/}
                    {/*    }}/>*/}
                    {/*</HtmlTooltip>*/}
                </div>
            </CardActions>
        </Card>
    )
})

export default CardCom
