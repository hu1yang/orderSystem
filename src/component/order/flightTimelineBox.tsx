import React , {memo} from "react";
import styles from './styles.module.less'
import type {Segment} from "@/types/order.ts";
import {extractTimeWithTimezone} from "@/utils/public.ts";
import {formatTotalDuration , formatDuration} from "@/utils/price.ts";
import DataUsageIcon from "@mui/icons-material/DataUsage";

const FlightTimelineBox = memo(({segments}:{
    segments:Segment[]
}) => {
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
                                    <span> {segment.carrier} International Airport</span>
                                    <span> {segment.departureTerminal}</span>
                                </div>
                            </div>
                            <div className={`${styles.airInfomation} s-flex`}>
                                <div className={styles.airInfomationPicture}>

                                </div>
                                <div className={styles.airInfomationmains}>
                                    <p>Flight number {segment.flightNumber}</p>
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
                                    <span> {segment.carrier} International Airport</span>
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
