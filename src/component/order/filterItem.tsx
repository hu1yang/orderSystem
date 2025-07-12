import {memo, useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useNavigate} from "react-router";
import {
    formatDuration, formatTotalDuration,
} from "@/utils/price.ts";
import {setChannelCode, setResult, setResultItineraries} from "@/store/orderInfo.ts";


import {
    Box, Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    Typography
} from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import RestaurantIcon from '@mui/icons-material/Restaurant';

import FareCardsSlider from "@/component/order/detail.tsx";
import AirTooltip from "@/component/defult/AirTooltip.tsx";
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import PriceDetail from "@/component/order/priceDetail.tsx";

import type {
    LostPriceAmout,
    Result,
    Segment
} from "@/types/order.ts";

import styles from './styles.module.less'
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import {extractTimeWithTimezone} from "@/utils/public.ts";
import FlightTimelineBox from "@/component/order/flightTimelineBox.tsx";


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
                <Box
                    lineHeight={1}
                    className={'cursor-h'}
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
                    }}
                >
                    {flightSegment.departureAirport} {flightSegment.departureTerminal}
                </Box>
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
                <Typography
                    className={'cursor-h'}
                    sx={{ color: '#a0a4af', fontSize: '1.1em', mt: 0.5 }}
                    lineHeight={1}
                >
                    {flightSegment.arrivalAirport} {flightSegment.arrivalTerminal}
                </Typography>
            </Box>
        </Box>
    );
})

const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const
const FilterItem = memo(({segments,cheapAmount,currency,searchKey,itineraryKey}:{
    segments: Segment[]
    cheapAmount: LostPriceAmout
    currency:string
    searchKey: string
    itineraryKey: string
}) => {

    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const itinerarieQuery = useSelector((state: RootState) => state.ordersInfo.query.itineraries[airportActived])
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const dispatch = useDispatch()


    const navigate = useNavigate()

    const [disabledChoose, setDisabledChoose] = useState(false)

    const [open, setOpen] = useState(false)


    const openMore = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setChooseAmount(null)
    }


    const amountsResult = useMemo(() => {
        const searchResult = airSearchData.find(a => a.combinationKey === searchKey)
        return searchResult
    }, [searchKey,airSearchData]);


    const [priceChooseAmout, setPriceChooseAmout] = useState<LostPriceAmout>(cheapAmount)

    const [chooseAmount, setChooseAmount] = useState<{
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    }|null>(null)

    const handleChooseFnc = useCallback((value: {
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    },lostPriceValue:LostPriceAmout) => {
        setChooseAmount(value)
        setPriceChooseAmout(lostPriceValue)
    }, []);

    const submitResult = () => {
        setDisabledChoose(true)
        if(!chooseAmount) return
        const result = amountsResult?.combinationResult.find(result => result.contextId === chooseAmount.contextId)
        if(!result) return
        const itinerarie = result.itineraries.find(itinerarie => itinerarie.itineraryNo === airportActived)
        console.log(priceChooseAmout)
        const amount = priceChooseAmout.amounts[airportActived]
        if(chooseAmount.name !== amount.familyName ||  chooseAmount.code !== amount.familyCode) return
        if(!itinerarie) return
        const newItinerarie = {
            amounts:[{...amount}],
            itineraryNo:itinerarie.itineraryNo,
            itineraryKey: itinerarie.itineraryKey,
            subItineraryId: itinerarie.subItineraryId!,
            segments: itinerarie.segments
        }

        if(airportActived === 0){
            const resultObj = {
                contextId:result.contextId,
                policies:result.policies,
                resultType:result.resultType,
                currency:result.currency,
                resultKey:result.resultKey,
                itineraries:[{...newItinerarie}]
            } as Result
            dispatch(setChannelCode(chooseAmount.channelCode))
            dispatch(setResult(resultObj))
        }else{
            dispatch(setResultItineraries(newItinerarie))
        }
        if(query.itineraries.length  === airportActived+1){
            navigate('/passenger')
        }
        setDisabledChoose(false)
        setOpen(false)
    }

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
                            <div className={`${styles.leftInfoDetailTitle}`}>
                                <div className={`${styles.airTitle} s-flex flex-dir`}>
                                    {
                                        segments.map((segment) =>  <span key={segment.flightNumber}>{segment.flightNumber}</span>)
                                    }

                                </div>
                                {
                                    segments.some(segment => segment.flightMealType) && (
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
                                    <FlightTimeline segments={segments} />
                                }
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                        <div className={`${styles.priceBox} s-flex flex-dir ai-fe`}>
                            <div className={`s-flex ai-fe ${styles.price}`}>
                                <span>from</span>
                                <div>{currency}${cheapAmount.minTotal}</div>
                            </div>
                            <div>
                                <span>{itineraryTypeMap[itineraryType]}</span>
                            </div>
                        </div>
                        <Button variant='contained' onClick={openMore} sx={{
                            backgroundColor: 'var(--put-border-hover-color)',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                            color: 'var(--vt-c-white)',
                            width: '110px'

                        }}>
                            Select
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" className={styles.dialogFirport} sx={{
                '.MuiDialog-paperWidthLg': {
                    width: '1024px',
                    minWidth:'1000px'
                }
            }}>
                <DialogTitle sx={{
                    '&.MuiDialogTitle-root': {
                        padding: '32px 32px 16px'
                    }
                }}>
                    <div className={styles.firportTitle}>
                        <span>Trip to {itinerarieQuery.departure}</span>
                    </div>
                </DialogTitle>
                <DialogContent sx={{
                    '&.MuiDialogContent-root':{
                        backgroundColor:'#f6f7fa',
                        p:0
                    }
                }}>
                    <div className={`${styles.firportInfo}`}>
                        {
                            <FirportInfomation segments={segments} labelPostion={airportActived === 0 ? 'Depart':'Return'} />
                        }
                    </div>
                    <div style={{
                        backgroundColor:'#f6f7fa',
                        padding:'8px 32px 0'
                    }}>
                        {
                            <FareCardsSlider itineraryKey={itineraryKey} lostPriceAmout={priceChooseAmout.minTotal} amountsResult={amountsResult!} disabledChoose={disabledChoose} currency={currency} chooseAmount={chooseAmount} chooseFnc={handleChooseFnc} />
                        }
                    </div>
                </DialogContent>
                <DialogActions sx={{
                    '&.MuiDialogActions-root':{
                        backgroundColor:'#f6f7fa',
                        p: '16px 32px'
                    }
                }}>
                    <div className={`s-flex jc-fe ai-ct`}>
                        {
                                <Box className={''}>
                                    <div className={`s-flex ai-ct`}>
                                        <HtmlTooltip placement="top" sx={{
                                            width: 300,
                                            '.MuiTooltip-tooltip': {
                                                padding: 'var(--pm-16)',
                                            }
                                        }} title={
                                            <PriceDetail amounts={priceChooseAmout.amounts} totalPrice={priceChooseAmout.minTotal} currency={currency} />
                                        }>
                                            <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                                fontSize: 20,
                                                color: 'var(--active-color)',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    cursor: 'help',
                                                }
                                            }}>
                                                {currency}${priceChooseAmout.minTotal}</Typography>
                                        </HtmlTooltip>
                                    </div>
                                    <Typography variant="caption" color="text.secondary" ml={1}
                                                sx={{fontSize: 14,lineHeight: 1}}>{itineraryTypeMap[itineraryType]}</Typography>
                                </Box>
                        }
                        <Button
                            variant='contained'
                            fullWidth
                            size="large"
                            sx={{
                                backgroundColor: 'var(--active-color)',
                                fontSize:20,
                                flex:1,
                                ml:'20px',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#264fd3' },
                            }}
                            onClick={submitResult}
                        >
                            Continue
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>
        </div>
    )
})

export default FilterItem
