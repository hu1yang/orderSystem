import {memo, useCallback, useMemo, useRef, useState} from "react";
import Slider from 'react-slick';
import {Box, Card, CardContent, Typography, Divider, CardHeader, Radio} from '@mui/material';
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
import type {AirSearchData, Amount, LostPriceAmout, Luggage} from "@/types/order.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import PriceDetail from "@/component/order/priceDetail.tsx";
import {getLayeredTopCombos} from "@/utils/order.ts";


const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const



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

function ruleContent(value:string[],type:string) {
    return <>
        {
            !!value.length && (
                <HtmlTooltip placement="bottom" sx={{
                    '.MuiTooltip-tooltip':{
                        fontSize: '1rem',
                        p:{
                            fontSize: '1em',
                            color: 'var(--tips-color)'
                        }
                    }
                }} title={
                    value.map(rule => <p key={rule}>{rule}</p>)
                }>
                    <Typography variant="body2" className={styles.detailText}
                                sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                        <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                        <span className={`${styles.texts} elli-1`}>{type}:{value.map(rule => rule).join(',')}</span>
                    </Typography>
                </HtmlTooltip>
            )
        }
    </>
}

function renderContent(luggage: Luggage) {
    switch (luggage.luggageType) {
        case 'carry':
            return (
                <>
                    <AdfScannerIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                    <span className={styles.texts}>
                        Carry-on baggage: <strong>1 × {luggage.luggageCount} {luggage.luggageSizeType}</strong>
                    </span>
                </>
            )
            break;
        case 'checked':
            return (
                <>
                    <LuggageIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                    <span className={styles.texts}>
                        Checked baggage: <strong>1 × {luggage.luggageCount} {luggage.luggageSizeType}</strong>
                    </span>
                </>
            )
            break;
        case 'hand':
            return (
                <>
                    <BusinessCenterIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                    <span className={styles.texts}>
                        Handed baggage:<strong>1 × {luggage.luggageCount} {luggage.luggageSizeType}</strong>
                    </span>
                </>
            )
        default:
            return <></>

    }
}

const SliderBox = memo(({lostPrice,amount,identification,disabledChoose,currency, chooseAmount,chooseAmountfnc,lostPriceAmout,style}:{
    lostPriceAmout: number
    amount: Amount
    identification:{
        channelCode: string
        contextId:string
        resultKey:string
    }
    disabledChoose:boolean
    currency:string
    chooseAmount:{
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    }|null
    chooseAmountfnc:(value:{
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    },lostPriceValue:LostPriceAmout) => void
    style?: React.CSSProperties
    lostPrice: LostPriceAmout
}) => {
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)

    const formattedDiff = useMemo(() => {
        const diff = lostPrice.minTotal - lostPriceAmout;
        const sign = diff < 0 ? '' : '+'; // 负数原样，其它加 "+"
        return `${sign}${diff.toFixed(2)}`;
    }, [lostPrice, lostPriceAmout]);

    const chooseBool = useMemo(() => {
        return chooseAmount &&
            chooseAmount.name === amount.familyName &&
            chooseAmount.code === amount.familyCode &&
            chooseAmount.channelCode === identification.channelCode &&
            chooseAmount.contextId === identification.contextId &&
            chooseAmount.resultKey === identification.resultKey;
    }, [
        amount,
        chooseAmount,
        identification
    ]);

    const chooseFnc = useCallback(() => {
        chooseAmountfnc({
            ...identification,
            name: amount.familyName,
            code: amount.familyCode,
        },lostPrice);
    }, [chooseAmountfnc, identification, amount,lostPrice]);



    return (
        <Box sx={{width: 320,...style}}>
            <Card className={'cursor-p'} onClick={chooseFnc} sx={{
                width: 319,height: 390, borderRadius: '4px', padding: '16px 24px',
                boxShadow: chooseBool ? 'inset 0 0 0 3px var(--back-color)' : 'inset 0 0 0 3px transparent',
                '.MuiCardContent-root': {
                    padding: '0'
                },
            }}>
                <CardHeader sx={{
                    p: 0
                }} title={
                    <Typography fontWeight="bold" fontSize="1.6rem"
                                gutterBottom>{amount.familyName}</Typography>
                } action={
                    <Radio
                        disabled={disabledChoose}
                        checked={!!chooseBool}
                        onChange={chooseFnc}
                        value={
                            `${amount.familyName} -${amount.familyCode} -${identification.channelCode} -${identification.contextId}-${identification.resultKey}`
                        }
                        color="primary"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: 28,
                            },
                        }}
                    />
                }/>
                <CardContent>
                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem" mt={1}>Baggage</Typography>
                    <div style={{height: '80px'}}>
                        {amount.luggages.map((luggage, luggageIndex) => (
                            <Typography key={luggageIndex} variant="body2" className={styles.detailText}
                                        sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                                {
                                    renderContent(luggage)
                                }
                            </Typography>
                        ))}
                    </div>

                    <Divider sx={{my: 1.5}}/>

                    <Typography fontWeight="bold" fontSize="1.1rem">Fare Rules</Typography>
                    <div style={{height: '100px'}}>
                        {
                            ruleContent(amount.refundNotes as string[],'Refund Policy')
                        }

                        {
                            ruleContent(amount.changeNotes as string[],'Change Policy')
                        }
                        {
                            ruleContent(amount.cancelNotes as string[],'Cancellation Policy')
                        }
                        {
                            ruleContent(amount.othersNotes as string[],'Other Policy')
                        }

                    </div>


                    <Box mt={2}>
                        <HtmlTooltip placement="top" sx={{
                            width: 300,
                            '.MuiTooltip-tooltip': {
                                padding: 'var(--pm-16)',
                            }
                        }} title={
                            <PriceDetail amounts={lostPrice.amounts} totalPrice={lostPrice.minTotal} currency={currency} />
                        }>
                            <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                fontSize: 20,
                                color: 'var(--active-color)',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'help',
                                }
                            }}>{currency}${formattedDiff}</Typography>
                        </HtmlTooltip>
                        <Typography variant="caption" color="text.secondary" ml={1}
                                    sx={{fontSize: 14}}>{itineraryTypeMap[itineraryType]}</Typography>
                    </Box>


                </CardContent>
            </Card>
        </Box>
    )
})

const FareCardsSlider = memo(({amountsResult,chooseAmount,chooseFnc,currency,disabledChoose,lostPriceAmout}: {
    lostPriceAmout: number
    amountsResult: AirSearchData
    chooseAmount: {
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    }|null
    chooseFnc: (value: {
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    },lostPriceValue:LostPriceAmout) => void
    currency:string
    disabledChoose:boolean
}) => {
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)

    const amountsMemo = useMemo(() => {
        const result = getLayeredTopCombos(
            amountsResult.combinationResult,
            airportActived,
            airChoose)
        return result
    }, []);

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


    const handleChooseAmount = useCallback((value: {
        name:string
        code:string
        channelCode: string
        contextId:string
        resultKey:string
    },lostPriceValue:LostPriceAmout) => {
        if (isDragging.current) return;
        if (disabledChoose) return;
        chooseFnc(value,lostPriceValue);
    }, [disabledChoose, chooseFnc,chooseAmount]);

    return (
        <Box position="relative" px={0} py={.2} className={styles.fareCardsSlider}>
            {
                amountsMemo.length > 2 ?
                    <Slider {...settings} ref={sliderRef}>
                        {amountsMemo.map((amountResult) => (
                            <SliderBox lostPriceAmout={lostPriceAmout} chooseAmount={chooseAmount}
                                       chooseAmountfnc={handleChooseAmount}
                                       key={`${amountResult.sourceItem.channelCode}-${amountResult.sourceItem.contextId}-${amountResult.familyCode}`}
                                       identification={{
                                           channelCode:amountResult.sourceItem.channelCode,
                                           contextId:amountResult.sourceItem.contextId,
                                           resultKey:amountResult.sourceItem.resultKey,
                                       }}
                                       lostPrice={amountResult.lostPrice}
                                       amount={amountResult.amount}
                                       disabledChoose={disabledChoose} currency={currency}/>
                        ))}
                    </Slider> :
                    <div className={`s-flex flex-row`}>
                        {
                            amountsMemo.map((amountResult) => (
                                <SliderBox style={{marginRight:'23px'}} lostPriceAmout={lostPriceAmout} chooseAmount={chooseAmount}
                                           chooseAmountfnc={handleChooseAmount}
                                           key={`${amountResult.sourceItem.channelCode}-${amountResult.sourceItem.contextId}-${amountResult.familyCode}`}
                                           identification={{
                                               channelCode:amountResult.sourceItem.channelCode,
                                               contextId:amountResult.sourceItem.contextId,
                                               resultKey:amountResult.sourceItem.resultKey,
                                           }}
                                           lostPrice={amountResult.lostPrice}
                                           amount={amountResult.amount}
                                           disabledChoose={disabledChoose} currency={currency}/>

                            ))
                        }
                    </div>
            }
            {/*<div className={`${styles.fareCardsTips} s-flex ai-ct`}>*/}
            {/*    <img*/}
            {/*        src="https://static.tripcdn.com/packages/flight/static-image-online/latest/flight_v2/hotel_cross/pic_popup_small.png"*/}
            {/*        alt=""/>*/}
            {/*    <div className={`${styles.fareCardsTipsText} s-flex ai-ct`}>*/}
            {/*        <span>Get up to </span>*/}
            {/*        <strong>25% off</strong>*/}
            {/*        <span> stays by booking a flight, plus free cancellation for your stay if your flight is rescheduled</span>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </Box>
    );
})

export default FareCardsSlider
