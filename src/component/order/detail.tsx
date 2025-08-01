import {memo, useMemo, useRef, useState} from "react";
import Slider from 'react-slick';
import {Box, Card, CardContent, Typography, Divider, CardHeader, Button} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LuggageIcon from '@mui/icons-material/Luggage';
import AdfScannerIcon from "@mui/icons-material/AdfScanner";

import styles from './styles.module.less'
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import type {AirSearchData, ComboItem, Result} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import PriceDetail from "@/component/order/priceDetail.tsx";
import {getLayeredTopCombos} from "@/utils/order.ts";
import {setChannelCode, setResult, setResultItineraries} from "@/store/orderInfo.ts";
import {useNavigate} from "react-router";



function NextArrow({onClick,hidden}: { onClick?: () => void ,hidden:boolean}) {
    return (
        <Box sx={{
            position: 'absolute',
            right: 0,
            top: '40%',
            zIndex: 1,
            cursor: 'pointer',
            background: 'var(--vt-c-white)',
            border: '1px solid var(--put-border-color)',
            borderRadius: '4px',
            boxShadow: '0 4px 8px 0 rgba(15, 41, 77, .08)',
            color: 'var(--active-color)',
            width: 48,
            height: 48,
            opacity:hidden?0:1
        }} display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={onClick}>

            <ArrowForwardIosIcon/>
        </Box>
    );
}

function PrevArrow({onClick,hidden}: { onClick?: () => void,hidden:boolean }) {
    return (
        <Box sx={{
            position: 'absolute',
            left: 0,
            top: '40%',
            zIndex: 1,
            cursor: 'pointer',
            background: 'var(--vt-c-white)',
            border: '1px solid var(--put-border-color)',
            borderRadius: '4px',
            boxShadow: '0 4px 8px 0 rgba(15, 41, 77, .08)',
            color: 'var(--active-color)',
            width: 48,
            height: 48,
            opacity:hidden?0:1
        }} display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={onClick}>
            <ArrowBackIosNewIcon/>
        </Box>
    );
}

const SliderBox = memo(({amountResult,currency,style,amountsResultsObj}:{
    currency:string
    style?: React.CSSProperties
    amountResult: ComboItem
    amountsResultsObj: AirSearchData
}) => {
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [disabledChoose, setDisabledChoose] = useState(false)

    const luggagesMemo = useMemo(() => {
        const hand = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'hand') ?? null
        const checked = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'checked') ?? null
        const carry = amountResult.amount.luggages.find(luggage => luggage.luggageType === 'carry') ?? null
        return {
            hand,checked,carry
        }
    }, [amountResult.amount.luggages]);

    const submitResult = () => {
        setDisabledChoose(true)
        const result = amountsResultsObj.combinationResult.find(result => result.contextId === amountResult.sourceItem.contextId && result.resultKey === amountResult.resultKey)
        if(!result) return
        const newAmount = result.itineraries[airportActived].amounts.filter(amount => amount.familyName === amountResult.amount.familyName)
        const itinerarie = result.itineraries.find(itinerarie => itinerarie.itineraryNo === airportActived)
        if(!itinerarie) return
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
        if(query.itineraries.length  === airportActived+1){
            navigate('/passenger')
        }
        setDisabledChoose(false)
    }

    return (
        <Box sx={{width: 320,...style}}>
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

const FareCardsSlider = memo(({currency,searchKey}: {
    currency:string
    searchKey:string
}) => {
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)

    const amountsResultsObj = useMemo(() => {
        const searchResult = airSearchData.find(a => a.combinationKey === searchKey)
        return searchResult
    }, [searchKey,airSearchData]);


    const amountsMemo = useMemo(() => {
        if(!amountsResultsObj) return []
        const result = getLayeredTopCombos(
            amountsResultsObj.combinationResult,
            airportActived,
            airChoose)
        return result
    }, [amountsResultsObj]);

    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const isLast = currentSlide >= amountsMemo.length - 2.8;
    const isDragging = useRef(false);
    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        alignItems:'',
        slidesToShow: 2.8,
        slidesToScroll: 1,
        swipeToSlide:true,
        beforeChange: () => isDragging.current = true,
        afterChange: (index:number) => {
            setCurrentSlide(index)
            setTimeout(() => {
                isDragging.current = false;
            }, 0)
        },
        nextArrow:  <NextArrow hidden={isLast} />,
        prevArrow: <PrevArrow hidden={currentSlide < 1} />,
    };


    return (
        <Box position="relative" px={0} py={.2} className={styles.fareCardsSlider}>
            {
                amountsMemo.length > 2 ?
                    <Slider {...settings} ref={sliderRef}>
                        {amountsMemo.map((amountResult) => (
                            <SliderBox
                                       key={`${amountResult.sourceItem.channelCode}-${amountResult.sourceItem.contextId}-${amountResult.familyCode}`}
                                       amountResult={amountResult}
                                       amountsResultsObj={amountsResultsObj as AirSearchData}
                                       currency={currency}/>
                        ))}
                    </Slider> :
                    <div className={`s-flex flex-row`}>
                        {
                            amountsMemo.map((amountResult) => (
                                <SliderBox style={{marginRight:'23px'}}
                                           key={`${amountResult.sourceItem.channelCode}-${amountResult.sourceItem.contextId}-${amountResult.familyCode}`}
                                           amountResult={amountResult}
                                           amountsResultsObj={amountsResultsObj as AirSearchData}
                                           currency={currency}/>

                            ))
                        }
                    </div>
            }
        </Box>
    );
})

export default FareCardsSlider
