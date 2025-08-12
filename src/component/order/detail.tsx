import {memo, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {Box, Card, CardContent, Typography, Divider, CardHeader, Button} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LuggageIcon from '@mui/icons-material/Luggage';
import AdfScannerIcon from "@mui/icons-material/AdfScanner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';


import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import type {AirSearchData, ComboItem, Result} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import PriceDetail from "@/component/order/priceDetail.tsx";
import {getLayeredTopCombos} from "@/utils/order.ts";
import {setChannelCode, setDisabledChoose, setResult, setResultItineraries} from "@/store/orderInfo.ts";

import styles from './styles.module.less'
// Import Swiper styles
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';


const SliderBox = memo(({amountResult,currency,style,amountsResultsObj,itineraryKey}:{
    currency:string
    style?: React.CSSProperties
    amountResult: ComboItem
    amountsResultsObj: AirSearchData
    itineraryKey:string
}) => {
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const disabledChoose = useSelector((state:RootState) => state.ordersInfo.disabledChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const luggagesMemo = useMemo(() => {
        const hand = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'hand') ?? null
        const checked = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'checked') ?? null
        const carry = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'carry') ?? null
        return {
            hand,checked,carry
        }
    }, [amountResult.amount.luggages]);

    const submitResult = () => {
        dispatch(setDisabledChoose(true))
        const result = amountsResultsObj.combinationResult.find(result => result.contextId === amountResult.sourceItem.contextId && result.resultKey === amountResult.resultKey)
        if(!result) return
        const itinerarie = result.itineraries.find(itinerarie => itinerarie.itineraryNo === airportActived && itineraryKey === itinerarie.itineraryKey)
        if(!itinerarie) return
        const newAmount = itinerarie.amounts.filter(amount => amount.familyName === amountResult.amount.familyName)

        const newItinerarie = {
            amounts:[...newAmount],
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
            dispatch(setChannelCode(amountResult.channelCode))
            dispatch(setResult(resultObj))
        }else{
            dispatch(setResultItineraries(newItinerarie))
        }
        if(query.itineraries.length === airportActived+1){
            navigate('/passenger')
        }
        setTimeout(() => {
            dispatch(setDisabledChoose(false))
        },200)
    }

    return (
        <Box sx={{width: 250,...style}}>
            <Card className={'cursor-p'} sx={{
                width: 250, borderRadius: '4px', padding: '16px 24px',
                boxShadow: 'inset 0 0 0 3px transparent',
                '.MuiCardContent-root': {
                    padding: '0'
                },
            }}>
                <CardHeader sx={{
                    p: 0
                }} title={
                    <Typography fontWeight="bold" fontSize="1.6rem"
                                gutterBottom>{amountResult.amount.familyName}</Typography>
                }/>
                <CardContent>
                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem" mt={1}>Baggage</Typography>
                    <div>
                        <Typography fontWeight="400" fontSize="1.1rem" mt={1} className={'s-flex ai-ct'}>
                            <BusinessCenterIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={styles.texts}>
                                 {
                                     luggagesMemo.hand ? <strong>{luggagesMemo.hand.luggageCount} {luggagesMemo.hand.luggageSizeType}</strong> : '--'
                                 }
                            </span>
                        </Typography>
                        <Typography fontWeight="400" fontSize="1.1rem" mt={1} className={'s-flex ai-ct'}>
                            <LuggageIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={styles.texts}>
                                 {
                                     luggagesMemo.checked ? <strong>{luggagesMemo.checked.luggageCount} {luggagesMemo.checked.luggageSizeType}</strong> : '--'
                                 }
                            </span>
                        </Typography>
                        <Typography fontWeight="400" fontSize="1.1rem" mt={1} className={'s-flex ai-ct'}>
                            <AdfScannerIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={styles.texts}>
                                 {
                                     luggagesMemo.carry ? <strong>{luggagesMemo.carry.luggageCount} {luggagesMemo.carry.luggageSizeType}</strong> : '--'
                                 }
                            </span>
                        </Typography>
                    </div>

                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem">Fare Rules</Typography>
                    <div>
                        <div className={'s-flex ai-ct'}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amountResult.amount.cancelNotes.length ?
                                         <HtmlTooltip placement="top" sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amountResult.amount.cancelNotes.map((cancelNote,cancelNoteIndex) => (
                                                         <Typography key={cancelNoteIndex} fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                             fontSize: 12,
                                                         }}>
                                                             {cancelNote}
                                                         </Typography>
                                                     ))
                                                 }
                                             </div>

                                         }>
                                             <Typography fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                 fontSize: 12,
                                                 '&:hover': {
                                                     textDecoration: 'underline',
                                                     cursor: 'help',
                                                 }
                                             }}>{amountResult.amount.cancelNotes}
                                             </Typography>
                                         </HtmlTooltip>
                                          : '--'
                                 }
                            </span>
                        </div>
                        <div className={'s-flex ai-ct'}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amountResult.amount.changeNotes.length ?
                                         <HtmlTooltip placement="top" sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amountResult.amount.changeNotes.map((changeNote,changeNoteIndex) => (
                                                         <Typography key={changeNoteIndex} fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                             fontSize: 12,
                                                         }}>
                                                             {changeNote}
                                                         </Typography>
                                                     ))
                                                 }
                                             </div>

                                         }>
                                             <Typography fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                 fontSize: 12,
                                                 '&:hover': {
                                                     textDecoration: 'underline',
                                                     cursor: 'help',
                                                 }
                                             }}>{amountResult.amount.changeNotes}
                                             </Typography>
                                         </HtmlTooltip>
                                         : '--'
                                 }
                            </span>
                        </div>
                        <div  className={'s-flex ai-ct'}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amountResult.amount.refundNotes.length ?
                                         <HtmlTooltip placement="top" sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amountResult.amount.refundNotes.map((refundNote,refundNoteIndex) => (
                                                         <Typography key={refundNoteIndex} fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                             fontSize: 12,
                                                         }}>
                                                             {refundNote}
                                                         </Typography>
                                                     ))
                                                 }
                                             </div>

                                         }>
                                             <Typography fontWeight="400" fontSize="1.1rem" display="inline" sx={{
                                                 fontSize: 12,
                                                 '&:hover': {
                                                     textDecoration: 'underline',
                                                     cursor: 'help',
                                                 }
                                             }}>{amountResult.amount.refundNotes}
                                             </Typography>
                                         </HtmlTooltip>
                                         : '--'
                                 }
                            </span>
                        </div>
                    </div>

                    <Box mt={2}>
                        <HtmlTooltip placement="top" sx={{
                            width: 300,
                            '.MuiTooltip-tooltip': {
                                padding: 'var(--pm-16)',
                            }
                        }} title={
                            <PriceDetail amounts={amountResult.lostPrice.amounts} totalPrice={amountResult.lostPrice.minTotal} currency={currency} />
                        }>
                            <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                fontSize: 20,
                                color: 'var(--active-color)',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'help',
                                }
                            }}>{currency}${amountResult.lostPrice.minTotal}</Typography>
                        </HtmlTooltip>
                    </Box>
                    <Button variant="contained" disabled={disabledChoose} onClick={submitResult} className={'full-width'} sx={{
                        fontSize: '1.2rem',
                        mt:'10px',
                        borderRadius:'2px',
                        backgroundColor:'#f68201'
                    }}>Select</Button>
                </CardContent>
            </Card>
        </Box>
    )
})

const FareCardsSlider = memo(({currency,searchKey,itineraryKey}: {
    currency:string
    searchKey:string
    itineraryKey:string
}) => {
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const amountsResultsObj = useMemo(() => {
        const searchResult = airSearchData.find(a => a.combinationKey === searchKey)
        return searchResult
    }, [searchKey,airSearchData]);


    const amountsMemo = useMemo(() => {
        if(!amountsResultsObj) return []
        const result = getLayeredTopCombos(
            amountsResultsObj.combinationResult,
            airportActived,
            airChoose,itineraryKey)
        return result
    }, [amountsResultsObj,airportActived,airChoose]);


    return (
        <Box position="relative" px={0} py={.2} className={styles.fareCardsSlider}>
            <Box ref={prevRef} sx={{
                position: 'absolute',
                left: 0,
                top: '40%',
                zIndex: 99,
                cursor: 'pointer',
                background: 'var(--vt-c-white)',
                border: '1px solid var(--put-border-color)',
                borderRadius: '4px',
                boxShadow: '0 4px 8px 0 rgba(15, 41, 77, .08)',
                color: 'var(--active-color)',
                width: 48,
                height: 48,
                opacity: amountsMemo.length < 3 || isBeginning ? 0 : 1,
            }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <ArrowBackIosNewIcon/>
            </Box>
            <Box ref={nextRef} sx={{
                position: 'absolute',
                right: 0,
                top: '40%',
                zIndex: 99,
                cursor: 'pointer',
                background: 'var(--vt-c-white)',
                border: '1px solid var(--put-border-color)',
                borderRadius: '4px',
                boxShadow: '0 4px 8px 0 rgba(15, 41, 77, .08)',
                color: 'var(--active-color)',
                width: 48,
                height: 48,
                opacity: amountsMemo.length < 3 || isEnd ? 0 : 1,
            }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <ArrowForwardIosIcon/>
            </Box>
            <Swiper slidesPerView={2.8} spaceBetween={5} grabCursor={true} pagination={{clickable: true}}
                    onBeforeInit={(swiper) => {
                        // @ts-ignore
                        swiper.params.navigation.prevEl = prevRef.current;
                        // @ts-ignore
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    onProgress={(_, progress) => {
                        setIsBeginning(progress <= 0);
                        setIsEnd(progress >= 1);
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    modules={[Navigation]}>
                {
                    amountsMemo.map((amountResult) => (
                        <SwiperSlide
                            key={`${amountResult.sourceItem.channelCode}-${amountResult.sourceItem.contextId}-${amountResult.familyCode}`}>
                            <SliderBox
                               amountResult={amountResult}
                               itineraryKey={itineraryKey}
                               amountsResultsObj={amountsResultsObj as AirSearchData}
                               currency={currency}/>
                        </SwiperSlide>

                    ))
                }
            </Swiper>
        </Box>
    );
})

export default FareCardsSlider
