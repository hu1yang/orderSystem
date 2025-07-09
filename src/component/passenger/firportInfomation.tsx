import {memo} from "react";
import styles from './styles.module.less'
import {
    Chip,
    Divider,
} from "@mui/material";
import type {Segment} from "@/types/order.ts";
import { formatDateToShortString, formatFlyingTime} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";


const FirportInfomation = memo(({segments}:{
    segments:Segment[]
}) => {
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airportListLength = useSelector((state: RootState) => state.ordersInfo.airportList.length)


    return (
        <div className={styles.firportInfomation}>
            <div className={`${styles.firportDate} s-flex ai-ct`}>
                <Chip label={(airportActived === (airportListLength - 1)) ? 'Depart':'Return'} size={'small'} sx={{
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
                    <span>{formatDateToShortString(segments[0].arrivalTime)}</span>
                    <Divider orientation="vertical" sx={{
                        height: 10
                    }} flexItem/>
                    <span>Duration {formatFlyingTime(segments[0].totalFlyingTime!)}</span>
                </div>
            </div>
            <FlightTimelineBox segments={segments} />
        </div>
    )
})


export default FirportInfomation;
