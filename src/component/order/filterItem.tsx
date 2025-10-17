import {memo, useMemo, useState} from "react";
import { useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    amountPrice,
    findLowestAmount,
    formatDuration, formatTotalDuration, getLowestAmountsByItinerary,
} from "@/utils/order.ts";


import {
    Box, Button, Card, CardContent, CardHeader,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import RestaurantIcon from '@mui/icons-material/Restaurant';

import FareCardsSlider from "@/component/order/detail.tsx";
import AirTooltip from "@/component/defult/AirTooltip.tsx";

import type {
    Amount,
    Segment
} from "@/types/order.ts";

import styles from './styles.module.less'
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import {airlist, extractTimeWithTimezone} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useSearchData} from "@/context/order/SearchDataContext.tsx";


const FlightTimeline = memo(({segments}:{
    segments:Segment[]
}) => {

    const flightSegment = useMemo(() => {

        const departureAirport = segments[0]?.departureAirport
        const arrivalAirport = segments.at(-1)?.arrivalAirport

        const departureTime = segments[0]?.departureTime
        const arrivalTime = segments.at(-1)?.arrivalTime

        const departureTerminal = segments[0]?.departureTerminal
        const arrivalTerminal = segments.at(-1)?.arrivalTerminal

        const timer = segments.map(segment => segment.totalFlyingTime) as string[]

        // ⏱️ 计算中转等待时间（只在多段航程时）
        let transferTime = null
        if (segments.length > 1) {
            const prevArrival = segments[0].arrivalTime
            const nextDeparture = segments[1].departureTime
            if (prevArrival && nextDeparture) {
                transferTime = formatDuration(nextDeparture,prevArrival)
            }
        }

        return {
            departureAirport,
            departureTime,
            arrivalTime,
            arrivalAirport,
            totalTime: formatTotalDuration(timer),
            departureTerminal,
            arrivalTerminal,
            transferTime
        }

    }, [segments]);

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" flex={1} paddingLeft={'8px'} maxWidth={400}>
            <Box textAlign="center">
                <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>{extractTimeWithTimezone(flightSegment.departureTime)}</Typography>
                <HtmlTooltip placement="bottom" sx={{
                    '.MuiTooltip-tooltip': {
                        padding: '10px',
                    },
                    minWidth:'120px',
                    textAlign: 'center'
                }} title={
                    <Typography
                        className={`cursor-h`}
                        sx={{ color: 'var(--text-color)', fontSize: '1.1rem', mt: 0.5  }}
                        lineHeight={1}
                    >
                        {flightSegment.departureAirport} {flightSegment.departureTerminal}
                    </Typography>
                }>
                    <Box
                        lineHeight={1}
                        className={`cursor-h elli-1`}
                        sx={{
                            display: 'inline-block',
                            mt: 0.5,
                            px: 1,
                            py: 0.2,
                            backgroundColor: '#fff2ec',
                            color: '#f56c00',
                            fontSize: '1.1em',
                            borderRadius: '3px',
                            fontWeight: 500,
                            width: '90px'
                        }}
                    >
                        {flightSegment.departureAirport} {flightSegment.departureTerminal}
                    </Box>
                </HtmlTooltip>
            </Box>
            <HtmlTooltip placement="bottom" sx={{
                p: 0,
                '.MuiTooltip-tooltip': {
                    maxWidth: 600, // 或设置固定宽度 width: 300
                },
            }} title={
                <FlightTimelineBox segments={segments} />
            }>
                <Box flex="1" mx={2} position="relative" className={`cursor-p`}>
                    {/* 线条 */}
                    <Box
                        sx={{
                            height: '2px',
                            backgroundColor: '#d8dce5',
                            position: 'relative',
                            top: '50%',
                            '&.MuiBox-root': {
                                background: '#d8dce5',
                                position: 'relative',
                                '&::before': {
                                    content: '""', // ✅ 必须用字符串
                                    position: 'absolute',
                                    width: '6px',
                                    height: '6px',
                                    top: '50%',
                                    left: '0',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#d8dce5',
                                },
                                '&::after': {
                                    content: '""', // ✅ 必须用字符串
                                    position: 'absolute',
                                    width: '6px',
                                    height: '6px',
                                    top: '50%',
                                    right: '0',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#d8dce5',
                                },
                            }
                        }}
                    />
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '-18px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '1em',
                            color: '#a0a4af',
                        }}
                    >
                        {flightSegment.totalTime}
                    </Typography>
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '1rem',
                            color: '#a0a4af',
                        }}
                    >
                        {
                            segments.length < 2 ? 'Nonstop' : flightSegment.transferTime
                        }
                    </Typography>
                </Box>
            </HtmlTooltip>
            <Box textAlign="center">
                <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>{extractTimeWithTimezone(flightSegment.arrivalTime!)}</Typography>
                <HtmlTooltip placement="bottom" sx={{
                    '.MuiTooltip-tooltip': {
                        padding: '10px',
                    },
                    minWidth:'120px',
                    textAlign: 'center'
                }} title={
                    <Typography
                        className={`cursor-h`}
                        sx={{ color: 'var(--text-color)', fontSize: '1.1rem', mt: 0.5  }}
                        lineHeight={1}
                    >
                        {flightSegment.arrivalAirport} {flightSegment.arrivalTerminal}
                    </Typography>
                }>
                    <Typography
                        className={`cursor-h elli-1`}
                        sx={{ color: '#a0a4af', fontSize: '1.1em', mt: 0.5 , width: '90px' }}
                        lineHeight={1}
                    >
                        {flightSegment.arrivalAirport} {flightSegment.arrivalTerminal}
                    </Typography>
                </HtmlTooltip>
            </Box>
        </Box>
    );
})

const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const
const FilterItem = memo(() => {
    const searchData = useSearchData();

    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)


    const [open, setOpen] = useState(false)

    const nextCheapAmount = useMemo(() => {
        const airFilter = airSearchData.find(airSearch => airSearch.channelCode === searchData?.channelCode && airSearch.contextId === searchData.contextId && airSearch.resultKey === searchData?.resultKey)
        if(!airFilter) return []
        const airResult = airFilter.itinerariesMerge.filter(it => it.itineraryNo > airportActived)
        const result = getLowestAmountsByItinerary(airResult)
        return result
    }, [airSearchData,searchData,airportActived]);

    const cheapAmount = useMemo(() => {
        let beforeAmount: Amount[] = [];

        if (airChoose.result) {
            beforeAmount = airChoose.result.itineraries
            .map(it => it.amounts.find(amt => amt.passengerType === 'adt'))
            .filter((a): a is Amount => Boolean(a));
        }

        const currentCheapAmount = findLowestAmount(
            searchData?.amountsMerge?.flatMap(a => a.amounts.filter(am => am.passengerType === 'adt') ?? []) ?? []
        );

        const result  = [
            ...beforeAmount,
            ...(currentCheapAmount ? [currentCheapAmount] : []),
            ...(nextCheapAmount ?? [])
        ] as Amount[];
        return result;
    }, [searchData, nextCheapAmount, airChoose]);


    const lostPrice = useMemo(() => {
        if(!cheapAmount) return 0
        const price = amountPrice(cheapAmount as Amount[])
        return price
    },[cheapAmount])

    return  (
        <div className={styles.filterItem}>
            <div className={styles.filterItemBox}>
                <div className={`${styles.filterTips} s-flex ai-ct`}>
                    <div className={`${styles.tipsIcon} s-flex ai-ct`}>
                        <LuggageIcon sx={{fontSize:14, color: 'var(--keynote-text)' }} />
                        <AdfScannerIcon sx={{fontSize:14, color: 'var(--keynote-text)' }} />
                        <span>Included</span>
                    </div>
                </div>
                <div className={`${styles.airInfomation} s-flex ai-ct`}>
                    <div className={`${styles.leftInfo} s-flex flex-1 ai-ct`}>
                        <div className={`${styles.leftInfoDetail} s-flex`}>
                            <div className={styles.picture}>
                                <img src={airlist[searchData?.channelCode as string].picture} alt=""/>
                            </div>
                            <div className={`${styles.leftInfoDetailTitle}`}>
                                <div className={`${styles.airTitle} s-flex flex-dir`}>
                                    <span className={styles.airTitleSpan}>{airlist[searchData?.channelCode as string].title}</span>
                                    {
                                        searchData?.segments.map((segment) => (
                                            <Typography variant="body2" gutterBottom sx={{ fontSize: '1rem' , color: 'var(--tips-gary-color)' }} key={segment.flightNumber}>{segment.flightNumber}</Typography>
                                        ))
                                    }
                                </div>
                                {
                                    searchData?.segments.some(segment => segment.flightMealType) && (
                                        <HtmlTooltip title={
                                            <AirTooltip />
                                        }>
                                            <div className={styles.airIcon}>
                                                <RestaurantIcon />
                                            </div>
                                        </HtmlTooltip>
                                    )
                                }

                            </div>
                        </div>
                        <Grid container className={'flex-1'} spacing={2}>
                            <Grid size={12}>
                                {
                                    <FlightTimeline segments={searchData?.segments as Segment[]} />
                                }
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                        <div className={`${styles.priceBox} s-flex flex-dir ai-fe`}>
                            <div className={`s-flex ai-fe ${styles.price}`}>
                                <span>from</span>
                                <div>{searchData?.currency}${lostPrice}</div>
                            </div>
                            <div>
                                <span>{itineraryTypeMap[itineraryType]}</span>
                            </div>
                        </div>
                        {/*<Button variant='contained' onClick={openMore} sx={{*/}
                        {/*    backgroundColor: 'var(--put-border-hover-color)',*/}
                        {/*    fontWeight: 'bold',*/}
                        {/*    fontSize: '1.2em',*/}
                        {/*    color: 'var(--vt-c-white)',*/}
                        {/*    width: '110px'*/}

                        {/*}}>*/}
                        {/*    Select*/}
                        {/*</Button>*/}
                        <Button variant='contained' endIcon={!open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />} onClick={() => setOpen(!open)} sx={{
                            backgroundColor: !open ? 'var(--put-border-hover-color)' : 'transparent',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                            color: !open ? 'var(--vt-c-white)' : 'var(--active-color)',
                            width: '110px'

                        }}>
                            {!open?'Select':'Hide'}
                        </Button>
                    </div>
                </div>
            </div>
            <div style={{maxHeight: open ? 600: 0}} className={`${styles.filterItemMore} s-flex`}>
                <div className={styles.introduction}>
                    <Card sx={{
                        borderRadius: 0,
                        padding: '16px 0',
                        boxShadow:'none',
                        backgroundColor: 'transparent',
                        '.MuiCardContent-root': {
                            padding: '0'
                        },
                    }}>
                        <CardHeader sx={{
                            p: 0
                        }} title={
                            <Typography fontWeight="bold" fontSize="1.6rem"
                                        gutterBottom>Fare type</Typography>
                        } />
                        <CardContent>
                            <Divider sx={{my: 1.5}}/>
                            <Typography fontWeight="bold" fontSize="1.1rem" mt={1}>Baggage</Typography>
                            <div >
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Hand baggage</Typography>
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Check baggage</Typography>
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Carry baggage</Typography>
                            </div>
                            <Divider sx={{my: 1.5}}/>
                            <Typography fontWeight="bold" fontSize="1.1rem">Fare Rules</Typography>
                            <div>
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Cancellation</Typography>
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Rebooking</Typography>
                                <Typography fontWeight="400" fontSize="1.1rem" mt={1}>Refund</Typography>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <FareCardsSlider nextCheapAmount={nextCheapAmount as Amount[]} />
            </div>
        </div>
    )
})

export default FilterItem
