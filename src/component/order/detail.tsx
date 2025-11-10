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
import type {Amount, Result} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import PriceDetail from "@/component/order/priceDetail.tsx";
import {amountPrice, findLowestAmount} from "@/utils/order.ts";
import {setChannelCode, setDisabledChoose, setResult, setResultItineraries} from "@/store/orderInfo.ts";

import styles from './styles.module.less'
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/pagination';
import {useSearchData} from "@/context/order/SearchDataContext.tsx";


const SliderBox = memo(({amount,nextCheapAmount,itineraryKey}:{
    amount:Amount
    nextCheapAmount:Amount[]
    itineraryKey:string
}) => {
    const searchData = useSearchData();


    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const disabledChoose = useSelector((state:RootState) => state.ordersInfo.disabledChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const luggagesMemo = useMemo(() => {
        const hand = amount.luggages.find(luggage => luggage.luggageType === 'hand') ?? null
        const checked = amount.luggages.find(luggage => luggage.luggageType === 'checked') ?? null
        const carry = amount.luggages.find(luggage => luggage.luggageType === 'carry') ?? null
        return {
            hand,checked,carry
        }
    }, [amount.luggages]);

    const cheapAmount = useMemo(() => {
        let beforeAmount: Amount[] = [];

        if (airChoose.result) {
            beforeAmount = airChoose.result.itineraries
            .map(it => it.amounts.find(amt => amt.passengerType === 'adt'))
            .filter((a): a is Amount => Boolean(a));
        }

        const currentCheapAmount = findLowestAmount([amount])
        return [
            ...beforeAmount,
            ...(currentCheapAmount ? [currentCheapAmount] : []),
            ...nextCheapAmount
        ]
    }, [nextCheapAmount,airChoose,amount]);

    const lostPrice = useMemo(() => {
        if(!cheapAmount) return 0
        const price = amountPrice(cheapAmount as Amount[])
        return price
    },[cheapAmount])


    const submitResult = () => {
        dispatch(setDisabledChoose(true))
        const airport = airSearchData.find(airport => airport.channelCode === searchData?.channelCode && airport.contextId === searchData?.contextId && airport.resultKey === searchData?.resultKey)
        if(!airport) return;
        const filteritMer = airport.itinerariesMerge.filter(itm => itm.itineraryNo === airportActived)

        const parent = filteritMer.find(item =>
            item.amountsMerge.some(amr => amr.itineraryKey === itineraryKey)
        );

        const chooseAmount = parent?.amountsMerge
        .find(amr => amr.itineraryKey === itineraryKey)
            ?.amounts.filter(am => am.familyName === amount.familyName);


        const newItinerarie = {
            amounts:[...chooseAmount!],
            itineraryNo: parent!.itineraryNo,
            itineraryKey: itineraryKey,
            segments: parent!.segments
        }
        if(airportActived === 0){
            const resultObj = {
                contextId:airport.contextId,
                patterns:airport.patterns,
                resultType:airport.resultType,
                currency:airport.currency,
                resultKey:airport.resultKey,
                itineraries:[{...newItinerarie}]
            } as Result
            dispatch(setChannelCode(airport.channelCode))
            dispatch(setResult(resultObj))
        }else{
            dispatch(setResultItineraries(newItinerarie))
        }
        if(query.itineraries.length === airportActived+1){
            navigate('/passenger')
        }
        setTimeout(() => {
            dispatch(setDisabledChoose(false))
        },500)
    }

    return (
        <Box sx={{width: 250}}>
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
                                gutterBottom>{amount.familyName}</Typography>
                }/>
                <CardContent>
                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem" mt={1}>Baggage</Typography>
                    <div>
                        <HtmlTooltip placement="left" disableHoverListener={!luggagesMemo.hand} sx={{
                            '.MuiTooltip-tooltip': {
                                fontSize: "1.1rem",
                                padding: 'var(--pm-16)',
                            }
                        }} title={
                            <div className={styles.texts}>{luggagesMemo.hand ? luggagesMemo.hand.luggageNotes : '--'}</div>
                        }>
                            <Typography fontWeight="400" fontSize="1.1rem" mt={'8px'} className={'s-flex ai-ct'}>
                                <BusinessCenterIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                <span className={styles.texts}>
                                     {
                                         luggagesMemo.hand ? <strong>{luggagesMemo.hand.luggageCount} {luggagesMemo.hand.luggageSizeType}</strong> : '--'
                                     }
                                </span>
                            </Typography>
                        </HtmlTooltip>
                        <HtmlTooltip placement="left" disableHoverListener={!luggagesMemo.checked} sx={{
                            '.MuiTooltip-tooltip': {
                                fontSize: "1.1rem",
                                padding: 'var(--pm-16)',
                            }
                        }} title={
                            <div className={styles.cityDetailSp}>{luggagesMemo.checked ? luggagesMemo.checked.luggageNotes : '--'}</div>
                        }>
                            <Typography fontWeight="400" fontSize="1.1rem" mt={'8px'} className={'s-flex ai-ct'}>
                                <LuggageIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                <span className={styles.texts}>
                                     {
                                         luggagesMemo.checked ? <strong>{luggagesMemo.checked.luggageCount} {luggagesMemo.checked.luggageSizeType}</strong> : '--'
                                     }
                                </span>
                            </Typography>
                        </HtmlTooltip>
                        <HtmlTooltip placement="left" disableHoverListener={!luggagesMemo.carry} sx={{
                            '.MuiTooltip-tooltip': {
                                fontSize: "1.1rem",
                                padding: 'var(--pm-16)',
                            }
                        }} title={
                            <span className={styles.cityDetailSp}>{luggagesMemo.carry ? luggagesMemo.carry.luggageNotes : '--'}</span>
                        }>
                            <Typography fontWeight="400" fontSize="1.1rem" mt={'8px'} className={'s-flex ai-ct'}>
                                <AdfScannerIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                <span className={styles.texts}>
                                     {
                                         luggagesMemo.carry ? <strong>{luggagesMemo.carry.luggageCount} {luggagesMemo.carry.luggageSizeType}</strong> : '--'
                                     }
                                </span>
                            </Typography>
                        </HtmlTooltip>
                    </div>

                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem">Fare Rules</Typography>
                    <div>
                        <div className={`${styles.contentText} s-flex ai-ct`}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amount.cancelNotes.length ?
                                         <HtmlTooltip placement="left" sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amount.cancelNotes.map((cancelNote,cancelNoteIndex) => (
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
                                             }}>{amount.cancelNotes}
                                             </Typography>
                                         </HtmlTooltip>
                                          : '--'
                                 }
                            </span>
                        </div>
                        <div className={`${styles.contentText} s-flex ai-ct`}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amount.changeNotes.length ?
                                         <HtmlTooltip placement="left" sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amount.changeNotes.map((changeNote,changeNoteIndex) => (
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
                                             }}>{amount.changeNotes}
                                             </Typography>
                                         </HtmlTooltip>
                                         : '--'
                                 }
                            </span>
                        </div>
                        <div className={`${styles.contentText} s-flex ai-ct`}>
                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                            <span className={`${styles.texts} elli-1`}>
                                 {
                                     amount.refundNotes.length ?
                                         <HtmlTooltip sx={{
                                             '.MuiTooltip-tooltip': {
                                                 padding: 'var(--pm-16)',
                                             }
                                         }} placement="left" title={
                                             <div className={'s-flex flex-dir'}>
                                                 {
                                                     amount.refundNotes.map((refundNote,refundNoteIndex) => (
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
                                             }}>{amount.refundNotes}
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
                            <PriceDetail amounts={cheapAmount as Amount[]} totalPrice={lostPrice} currency={searchData?.currency as string} />
                        }>
                            <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                fontSize: 20,
                                color: 'var(--active-color)',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'help',
                                }
                            }}>{searchData?.currency}${lostPrice}</Typography>
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

const FareCardsSlider = memo(({nextCheapAmount}: {
    nextCheapAmount:Amount[]
}) => {
    const searchData = useSearchData();

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const amountsMemo = useMemo(() => {
        const result = searchData?.amountsMerge
        .flatMap(item =>
            item.amounts
            .filter(am => am.passengerType === 'adt').map(amount => ({
                itineraryKey: item.itineraryKey,
                amount
            }))
        );
        return result!;
    }, [searchData]);



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
                    amountsMemo.map((amountsMerge) => (
                        <SwiperSlide
                            key={`${amountsMerge.itineraryKey}-${amountsMerge.amount.familyCode}`}>
                            <SliderBox
                                amount={amountsMerge.amount}
                                nextCheapAmount={nextCheapAmount}
                                itineraryKey={amountsMerge.itineraryKey}
                                />
                        </SwiperSlide>

                    ))
                }
            </Swiper>
        </Box>
    );
})

export default FareCardsSlider
