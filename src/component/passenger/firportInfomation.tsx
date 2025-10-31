import {memo} from "react";
import styles from './styles.module.less'
import {
    Chip,
    Divider,
} from "@mui/material";
import type {Amount, Segment} from "@/types/order.ts";
import { formatDateToShortString, formatFlyingTime} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";
import {useNavigate} from "react-router";


const FirportInfomation = memo(({segments,labelPostion,index,amounts}:{
    segments:Segment[]
    index:number;
    labelPostion:string
    amounts?:Amount[]|null
}) => {
    const navigate = useNavigate()
    const backOrder = () => {
        navigate('/')
    }
    return (
        <div className={styles.firportInfomation}>
            <div className={`${styles.firportDate} s-flex ai-ct`}>
                <Chip label={labelPostion} size={'small'} sx={{
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
                    <span>{formatDateToShortString(segments[0].departureTime)}</span>
                    <Divider orientation="vertical" sx={{
                        height: 10
                    }} flexItem/>
                    <span>Duration {formatFlyingTime(segments[0].totalFlyingTime!)}</span>

                </div>
                {
                    index === 0 && (
                        <div className={`${styles.firportSet} cursor-p s-flex ai-ct`} onClick={backOrder}>
                            <span>Change Flight</span>
                        </div>
                    )
                }

            </div>
            <FlightTimelineBox segments={segments} amounts={amounts} />
        </div>
    )
})


export default FirportInfomation;
