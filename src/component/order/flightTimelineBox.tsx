import React, {memo, useMemo} from "react";
import styles from './styles.module.less'
import type {Amount, Segment} from "@/types/order.ts";
import {extractTimeWithTimezone} from "@/utils/public.ts";
import {formatTotalDuration , formatDuration} from "@/utils/order.ts";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {useLocation} from "react-router";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const FlightTimelineBox = memo(({segments,amounts}:{
    segments:Segment[]
    amounts?:Amount[]|null
}) => {
    const {pathname} = useLocation()

    const amountMemo = useMemo(() => {
        const amount = amounts?.find(am => am.passengerType === 'adt')
        return amount ?? null
    },[amounts])

    return (
        <div className={styles.flightTimelineBox}>
            {
                segments.map((segment,segmentIndex) => (
                    <React.Fragment key={segment.flightNumber}>
                        <div className={styles.flightTimeline}>
                            <div className={`${styles.airinfoLine} s-flex ai-ct`}>
                                <div className={styles.timer}>{extractTimeWithTimezone(segment.departureTime)}</div>
                                <div className={styles.airTitle}>
                                    <span> {segment.departureAirport}</span>
                                    <span> {segment.carrier} Airport</span>
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
                                    <p>Flight number {segment.flightNumber}
                                        {
                                            !!segment.flightMealType && <RestaurantIcon sx={{fontSize: '1.3rem',ml:'10px'}} />
                                        }
                                    </p>
                                    {
                                        segment.shareToFlightNo && <p>Share Flight number {segment.shareToFlightNo}</p>
                                    }
                                    <p>Flight time: {formatTotalDuration([segment.totalFlyingTime!])}</p>
                                    <p>Aircraft Model: {segment.aircraftModel}</p>
                                </div>
                            </div>
                            <div className={`${styles.airinfoLine} s-flex ai-ct`}>
                                <div className={styles.timer}>{extractTimeWithTimezone(segment.arrivalTime)}</div>
                                <div className={styles.airTitle}>
                                    <span> {segment.arrivalAirport}</span>
                                    <span> {segment.carrier} Airport</span>
                                    <span> {segment.arrivalTerminal}</span>
                                </div>
                            </div>
                        </div>
                        {
                            segmentIndex < segments.length -1  && (
                                <div className={styles.transfer}>
                                    <div className={`${styles.transferInfo} s-flex flex-dir`}>
                                            <span>Transfer in {segments[segmentIndex].arrivalAirport} {
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
                                                    <span>Different Terminal</span>
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
