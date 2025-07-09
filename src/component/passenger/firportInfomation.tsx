import {memo} from "react";
import styles from './styles.module.less'
import {
    Chip,
    Divider,
} from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WifiIcon from "@mui/icons-material/Wifi";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import AirTooltip from "@/component/defult/AirTooltip.tsx";
import type {Segment} from "@/types/order.ts";
import {extractTimeWithTimezone, formatDateToShortString, formatFlyingTime} from "@/utils/public.ts";


const FirportInfomation = memo(({segment}:{
    segment:Segment
}) => {
    return (
        <div className={styles.firportInfomation}>
            <div className={`${styles.firportDate} s-flex ai-ct`}>
                <Chip label="Depart" size={'small'} sx={{
                    background: 'var(--active-color)',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: 'var(--vt-c-white)',
                    fontWeight: 'bold',
                    '.MuiChip-label': {
                        fontSize: '1.2em',
                    }
                }}/>
                <div className={`${styles.firportDateLabel} s-flex ai-ct`}>
                    <span>{formatDateToShortString(segment.arrivalTime)}</span>
                    <Divider orientation="vertical" sx={{
                        height: 10
                    }} flexItem/>
                    <span>Duration {formatFlyingTime(segment.totalFlyingTime!)}</span>
                </div>
            </div>
            <div className={styles.infoNew}>
                <div className={`${styles.infoNewList} s-flex ai-ct`}>
                    <div className={styles.infoLabel}>{extractTimeWithTimezone(segment.departureTime!)}</div>
                    <div className={styles.infoValue}>
                        <strong>{segment.departureAirport}</strong>
                    </div>
                </div>
                <div className={`${styles.firportDetails} s-flex ai-ct`}>
                    <div className={`${styles.infoLabel} s-flex jc-ct`}>
                        <div className={styles.firPicture}>
                            <img
                                src="https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/fm.webp"
                                alt=""/>
                        </div>
                    </div>
                    <div className={`${styles.firTips} s-flex ai-ct`}>
                        <div className={`${styles.tipsLabel} s-flex ai-fs flex-dir`}>
                            <span> {segment.carrier}</span>
                            <span> {segment.flightNumber}</span>
                        </div>
                        <HtmlTooltip title={
                            <AirTooltip/>
                        }>
                            <div className={`${styles.airIcon} s-flex ai-ct`}>
                                <BoltIcon/>
                                <RestaurantIcon/>
                                <WifiIcon/>
                                <PlayCircleIcon/>
                            </div>
                        </HtmlTooltip>
                    </div>
                </div>
                <div className={`${styles.infoNewList} s-flex ai-ct`}>
                    <div className={styles.infoLabel}>{extractTimeWithTimezone(segment.arrivalTime!)}</div>
                    <div className={styles.infoValue}>
                        {segment.arrivalAirport}
                    </div>
                </div>
            </div>
        </div>
    )
})


export default FirportInfomation;
