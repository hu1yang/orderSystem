import {memo, useCallback, useMemo} from "react";
import styles from './styles.module.less'
import {
    Avatar,
    Divider, Stack
} from "@mui/material";
import type {Amount, Segment} from "@/types/order.ts";
import {airlist, formatDateToShortString, formatFlyingTime, isZhCN} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";
import defaultAir from "@/assets/air/default.webp";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";

const Itinerary = memo(({ segments }: { segments: Segment[] }) => {
    const cityList = useSelector((state: RootState) => state.ordersInfo.cityList);

    const airportDetail = useCallback(
        (value: string) => {
            const result = cityList.find(
                city => city.cityCode === value || city.airportCode === value
            );

            return result
                ? `${value} ${result[isZhCN ? 'cityCName' : 'cityEName']}`
                : value;
        },
        [cityList]
    );

    const itineraryDetail = useMemo(() => {
        if (!segments?.length) {
            return { from: '', to: '' };
        }

        const from = segments[0].departureAirport;
        const to = segments[segments.length - 1].arrivalAirport;

        return {
            from: airportDetail(from),
            to: airportDetail(to),
        };
    }, [segments, airportDetail]);

    return (
        <Stack
            direction="row"
            spacing={0.5}
            sx={{
                justifyContent: 'space-around',
                alignItems: 'center',
            }}
        >
            <span>{itineraryDetail.from}</span>
            <i className="iconfont icon-oneway" style={{ fontSize: '1.6rem' }} />
            <span>{itineraryDetail.to}</span>
        </Stack>
    );
});

const FirportInfomation = memo(({segments,amounts}:{
    segments:Segment[]
    amounts:Amount[]|null
}) => {
    const {t} = useTranslation()

    const channelCode = useSelector((state: RootState) => state.ordersInfo.airChoose.channelCode)

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

                <Avatar alt={airlist[channelCode].title} src={airlist[channelCode]?.picture ?? defaultAir} sx={{ width: 40, height: 40 }} />
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
