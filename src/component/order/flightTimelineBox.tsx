import React, {memo, useMemo} from "react";
import styles from './styles.module.less'
import type {Amount, Segment} from "@/types/order.ts";
import {cabinOptions, extractTimeWithTimezone} from "@/utils/public.ts";
import {formatTotalDuration , formatDuration} from "@/utils/order.ts";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {useLocation} from "react-router";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import dayjs from '@/utils/dayjs.ts';
import {Stack, Typography} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useTranslation} from "react-i18next";


const ThatDay = memo(({ timer, segments }: {
    timer: string
    segments: Segment[]
}) => {

    const departure = segments[0]?.departureTime

    return dayjs(departure).isSame(timer, 'day') ||  <Typography variant="caption" gutterBottom sx={{
        position: "absolute",
        fontSize:'1rem',
        top:'-15px',
        left:'50%',
        transform: 'translateX(-50%)',
        color:'var(--price-color)',
        whiteSpace: 'nowrap',
    }}>
        {dayjs(timer).format('MMM D')}
    </Typography>
})

const FlightTimelineBox = memo(({segments,amounts}:{
    segments:Segment[]
    amounts?:Amount[]|null
}) => {
    const {t} = useTranslation()

    const {pathname} = useLocation()

    const cabinValue = useSelector((state: RootState) => state.searchInfo.cabinValue)


    const amountMemo = useMemo(() => {
        const amount = amounts?.find(am => am.passengerType === 'adt')
        return amount ?? null
    },[amounts])

    const canbinLabel = useMemo(() => {
        const cabinOption = cabinOptions.find(op => op.value === cabinValue)
        return t(`order.${cabinOption?.label}`) ?? t('order.economy')
    }, [cabinValue]);



    return (
        <div className={styles.flightTimelineBox}>
            {
                segments.map((segment,segmentIndex) => (
                    <React.Fragment key={segment.flightNumber}>
                        <div className={styles.flightTimeline}>
                            <div className={`${styles.airinfoLine} s-flex ai-ct`}>
                                <div className={styles.timer}>
                                    {segmentIndex>0 && <ThatDay segments={segments} timer={segment.departureTime} />}
                                    {extractTimeWithTimezone(segment.departureTime)}</div>
                                <div className={styles.airTitle}>
                                    <span> {segment.departureAirport}</span>
                                    <span> {segment.carrier} {t('passenger.airport')}</span>
                                    <span> {segment.departureTerminal}</span>
                                </div>
                            </div>
                            <div className={`${styles.airInfomation} s-flex`}>
                                <div className={`${styles.airInfomationPicture} s-flex ai-ct jc-ct`}>
                                    {
                                        pathname !== '/passenger' ?
                                            <>
                                                <LuggageIcon />
                                                <AdfScannerIcon />
                                            </>
                                            :
                                            amountMemo?.luggages?.map(luggage => {
                                                if(luggage.luggageType === 'hand'){
                                                    return  <BusinessCenterIcon key='hand' />
                                                }else if(luggage.luggageType === 'checked'){
                                                    return  <LuggageIcon key='checked' />
                                                }
                                            })

                                    }

                                </div>
                                <div className={styles.airInfomationmains}>
                                    <p>{t('passenger.flightNumber')}: {segment.flightNumber}
                                        {
                                            !!segment.flightMealType && <RestaurantIcon sx={{fontSize: '1.3rem',ml:'10px'}} />
                                        }
                                        &nbsp;&nbsp;{canbinLabel}
                                    </p>
                                    {
                                        segment.shareToFlightNo && <p>{t('passenger.shareFlightNumber')}: {segment.shareToFlightNo}</p>
                                    }
                                    <p>{t('passenger.aircraftModel')}: {segment.aircraftModel}</p>
                                    <Stack direction="row" spacing={0.5} sx={{
                                        alignItems: "center",
                                    }}>
                                        <AccessTimeIcon fontSize="small" sx={{color:'var(--tips-gary-color)'}} />
                                        <p>{t('passenger.flightTime')}: {formatTotalDuration([segment.totalFlyingTime!])}</p>
                                    </Stack>
                                </div>
                            </div>
                            <div className={`${styles.airinfoLine} s-flex ai-ct`}>
                                <div className={styles.timer}>
                                    <ThatDay segments={segments} timer={segment.arrivalTime} />
                                    {extractTimeWithTimezone(segment.arrivalTime)}
                                </div>
                                <div className={styles.airTitle}>
                                    <span> {segment.arrivalAirport}</span>
                                    <span> {segment.carrier} {t('passenger.airport')}</span>
                                    <span> {segment.arrivalTerminal}</span>
                                </div>
                            </div>
                        </div>
                        {
                            segmentIndex < segments.length -1  && (
                                <div className={styles.transfer}>
                                    <div className={`${styles.transferInfo} s-flex flex-dir`}>
                                            <span>{t('passenger.transferIn',{airport:segments[segmentIndex].arrivalAirport})} {
                                                formatDuration(segments[segmentIndex + 1].departureTime,segments[segmentIndex].arrivalTime)
                                            }</span>
                                        {
                                            (segments[segmentIndex + 1].departureTerminal &&
                                                segments[segmentIndex].arrivalTerminal &&
                                                segments[segmentIndex + 1].departureTerminal !== segments[segmentIndex].arrivalTerminal) && (
                                                <div className={`${styles.diffTerminal} s-flex ai-ct`}>
                                                    <DataUsageIcon sx={{
                                                        fontSize: '1.2rem',
                                                        color: 'var(--price-color)',
                                                        mr:'5px'
                                                    }} />
                                                    <span>{t('passenger.differentTerminal')}</span>
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>
                            )
                        }
                    </React.Fragment>
                ))
            }
        </div>
    )
})


export default FlightTimelineBox;
