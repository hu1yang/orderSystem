import {memo} from "react";
import styles from './styles.module.less'
import {
    Avatar,
    Divider, Stack
} from "@mui/material";
import type {Amount, Segment} from "@/types/order.ts";
import {airlist, formatDateToShortString, formatFlyingTime} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";
import defaultAir from "@/assets/air/default.webp";
import {useTranslation} from "react-i18next";

const Itinerary = memo(({segments}:{
    segments:Segment[]
}) => {
    const arrival = segments[0].departureAirport
    let departure = ''
    if(segments.length === 1){
        departure = segments[0].arrivalAirport
    }else{
        departure = segments[segments.length-1].arrivalAirport
    }
    return (
        <Stack direction="row" spacing={0.5} sx={{
            justifyContent: "space-around",
            alignItems: "center",
        }}>
            <span>{arrival}</span>
            <i className={'iconfont icon-oneway'} style={{fontSize:'1.6rem'}} />
            <span>{departure}</span>
        </Stack>
    )
})

const FirportInfomation = memo(({segments,amounts}:{
    segments:Segment[]
    amounts:Amount[]|null
}) => {
    const {t} = useTranslation()

    return (
        <div className={styles.firportInfomation}>
            <div className={`${styles.firportDate} s-flex ai-ct`}>
                {/*<Chip label={labelPostion} size={'small'} sx={{*/}
                {/*    background: 'var(--active-color)',*/}
                {/*    borderRadius: '4px',*/}
                {/*    fontSize: '1rem',*/}
                {/*    color: 'var(--vt-c-white)',*/}
                {/*    fontWeight: 'bold',*/}
                {/*    '.MuiChip-label': {*/}
                {/*        fontSize: '1.2em',*/}
                {/*    }*/}
                {/*}}/>*/}

                <Avatar alt="Remy Sharp" src={airlist['API-C6-V1']?.picture ?? defaultAir}  sx={{ width: 46, height: 46 }} />
                <div className={`${styles.firportDateLabel} s-flex ai-ct`}>
                    <Itinerary segments={segments} />
                    <Divider orientation="vertical" variant="middle" sx={{
                        height: 10
                    }} flexItem/>
                    <span>{formatDateToShortString(segments[0].departureTime)}</span>
                    <Divider orientation="vertical" variant="middle" sx={{
                        height: 10
                    }} flexItem/>
                    <span>{segments[0].totalFlyingTime && `${t('passenger.duration')} ${formatFlyingTime(segments[0].totalFlyingTime!)}`}</span>
                </div>
            </div>
            <FlightTimelineBox segments={segments} amounts={amounts} />
        </div>
    )
})


export default FirportInfomation;
