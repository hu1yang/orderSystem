import Slider from 'react-slick';
import {Box, Card, CardContent, Typography, Divider, CardHeader, Radio} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import styles from './styles.module.less'
import {memo, useCallback, useMemo, useState} from "react";
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import type {Amount, Luggage} from "@/types/order.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";


const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const

const passengerTypes = {
    adt: 'adult',
    chd: 'child',
    inf: 'infant'
}

function NextArrow({onClick}: { onClick?: () => void }) {
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
        }} display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={onClick}>
            <ArrowForwardIosIcon/>
        </Box>
    );
}

function PrevArrow({onClick}: { onClick?: () => void }) {
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
        }} display={'flex'} alignItems={'center'} justifyContent={'center'} onClick={onClick}>
            <ArrowBackIosNewIcon/>
        </Box>
    );
}


const PriceDetail = memo(({amount}: {
    amount: Amount
}) => {
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)

    const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
    }, [])
    const totalPrice = useMemo(() => {
        return amount.printAmount + amount.taxesAmount
    }, [amount])

    return (
        <div className={styles.priceDetail} onMouseDown={stopPropagation}>
            <div className={styles.priceAbout}>
                <div className={`${styles.priceTitle} s-flex ai-ct jc-fe`}>
                    <div className={styles.priceFlight}>US${totalPrice}</div>
                    <p>/{passengerTypes[amount.passengerType]}</p>
                </div>
                <div className={`${styles.priceTips} s-flex jc-fe`}>
                    Avg. {itineraryTypeMap[itineraryType]} price per passenger
                </div>
                <Divider sx={{borderStyle: 'dashed', my: 1.5}}/>
                <div className={styles.details}>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                        <span>{passengerTypes[amount.passengerType]} Ticket </span>
                        <span>US${totalPrice}</span>
                    </div>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                        <span>Fare  </span>
                        <span>US${amount.printAmount}</span>
                    </div>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                        <span>Taxes & fees </span>
                        <span>US${amount.taxesAmount}</span>
                    </div>
                    <Divider sx={{borderStyle: 'dashed', my: 1.5}}/>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                        <span>{itineraryTypeMap[itineraryType]} Total</span>
                        <span>US${totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    )
})
const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 2.8,
    slidesToScroll: 1,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
};

function renderContent(luggage: Luggage) {
    switch (luggage.luggageType) {
        case 'carry':
            return (
                <>
                    <BusinessCenterIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                    <span className={styles.texts}>
                            Carry-on baggage: <strong>1 × {luggage.luggageCount} {luggage.luggageSizeType}</strong>
                        </span>
                </>
            )
            break;
        case 'checked':
            return (
                <>
                    <BusinessCenterIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
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

const FareCardsSlider = memo(({amounts,chooseFnc}: {
    amounts: Amount[]
    chooseFnc: (amount:Amount) => void
}) => {
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)

    const [chooseValue, setChooseValue] = useState('')

    const chooseAmount = (amount: Amount) => {
        setChooseValue(amount.familyCode)
        chooseFnc(amount)
    }


    return (
        <Box position="relative" px={0} py={.2} className={styles.fareCardsSlider}>
            <Slider {...settings}>
                {amounts.map((amount, amountIndex) => (
                    <Box key={`${amount.familyCode}-${amountIndex}`} sx={{width: 320}}>
                        <Card className={'cursor-p'} onClick={() => chooseAmount(amount)} sx={{
                            width: 319, height: 390, borderRadius: '4px', padding: '16px 24px',
                            boxShadow: chooseValue === amount.familyCode ? 'inset 0 0 0 1px var(--back-color)' : 0,
                            border: chooseValue === amount.familyCode ? '1px solid var(--back-color)': '1px solid var(--vt-c-white)',
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
                                    checked={chooseValue === amount.familyCode}
                                    onChange={() => chooseAmount(amount)}
                                    value={amount.familyCode}
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
                                <div style={{height: '70px'}}>
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
                                <div style={{height: '120px'}}>
                                    {amount.refundNotes.map((rule, i) => (
                                        <Typography key={i} variant="body2" className={styles.detailText}
                                                    sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                            <span className={styles.texts} dangerouslySetInnerHTML={{
                                                __html: rule
                                            }}/>
                                        </Typography>
                                    ))}
                                    {amount.changeNotes.map((rule, i) => (
                                        <Typography key={i} variant="body2" className={styles.detailText}
                                                    sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                            <span className={styles.texts} dangerouslySetInnerHTML={{
                                                __html: rule
                                            }}/>
                                        </Typography>
                                    ))}
                                    {amount.cancelNotes.map((rule, i) => (
                                        <Typography key={i} variant="body2" className={styles.detailText}
                                                    sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                            <span className={styles.texts} dangerouslySetInnerHTML={{
                                                __html: rule
                                            }}/>
                                        </Typography>
                                    ))}
                                    {amount.othersNotes.map((rule, i) => (
                                        <Typography key={i} variant="body2" className={styles.detailText}
                                                    sx={{display: 'flex', alignItems: 'center', mt: 0.5, fontSize: 13}}>
                                            <AccessTimeIcon sx={{fontSize: 16, color: '#00b894', mr: 0.5}}/>
                                            <span className={styles.texts} dangerouslySetInnerHTML={{
                                                __html: rule
                                            }}/>
                                        </Typography>
                                    ))}
                                </div>


                                <Box mt={2}>
                                    <HtmlTooltip placement="top" sx={{
                                        width: 300,
                                        'MuiTooltip-tooltip': {
                                            padding: 'var(--pm-16)',
                                        }
                                    }} title={
                                        <PriceDetail amount={amount}/>
                                    }>
                                        <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                            fontSize: 20, '&:hover': {
                                                textDecoration: 'underline',
                                                cursor: 'help'
                                            }
                                        }}>US${amount.printAmount + amount.taxesAmount}</Typography>
                                    </HtmlTooltip>
                                    <Typography variant="caption" color="text.secondary" ml={1}
                                                sx={{fontSize: 14}}>{itineraryTypeMap[itineraryType]}</Typography>
                                </Box>


                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Slider>
            <div className={`${styles.fareCardsTips} s-flex ai-ct`}>
                <img
                    src="https://static.tripcdn.com/packages/flight/static-image-online/latest/flight_v2/hotel_cross/pic_popup_small.png"
                    alt=""/>
                <div className={`${styles.fareCardsTipsText} s-flex ai-ct`}>
                    <span>Get up to </span>
                    <strong>25% off</strong>
                    <span> stays by booking a flight, plus free cancellation for your stay if your flight is rescheduled</span>
                </div>
            </div>
        </Box>
    );
})

export default FareCardsSlider
