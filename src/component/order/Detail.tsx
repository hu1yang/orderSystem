import Slider from 'react-slick';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LuggageIcon from "@mui/icons-material/Luggage";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import styles from './styles.module.less'
import {memo, useCallback} from "react";
import HtmlTooltip from "@/component/defult/Tooltip.tsx";

const fareData = [
    { title: 'Economy', baggage: [{icon: <LuggageIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Carry-on baggage: <strong>1 × 8 kg</strong>'}, {icon: <BusinessCenterIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Checked baggage: <strong> 20 kg</strong>'}], rules: ['Cancellation fee: from US$27.00', 'Change fee: from US$14.00', 'Ticketing: Within 1 hour after payment'], price: 388 },
    { title: 'Economy', baggage: [{icon: <LuggageIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Carry-on baggage: <strong>1 × 8 kg</strong>'}, {icon: <BusinessCenterIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Checked baggage: <strong> 20 kg</strong>'}], rules: ['Cancellation fee: from US$27.00', 'Change fee: from US$14.00', 'Ticketing: Within 1 hour after payment'], price: 388 },
    { title: 'Economy', baggage: [{icon: <LuggageIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Carry-on baggage: <strong>1 × 8 kg</strong>'}, {icon: <BusinessCenterIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} /> , text: 'Checked baggage: <strong> 20 kg</strong>'}], rules: ['Cancellation fee: from US$27.00', 'Change fee: from US$14.00', 'Ticketing: Within 1 hour after payment'], price: 388 },
];

function NextArrow(props) {
    const { onClick } = props;
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

function PrevArrow(props) {
    const { onClick } = props;
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
            <ArrowBackIosNewIcon />
        </Box>
    );
}

const PriceDetail = memo(() => {

    const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
    },[])

    return (
        <div className={styles.priceDetail} onMouseDown={stopPropagation}>
            <div className={styles.priceAbout}>
                <div className={`${styles.priceTitle} s-flex ai-ct jc-fe`}>
                    <div className={styles.priceFlight}>US$441</div>
                    <p>/adult</p>
                </div>
                <div className={`${styles.priceTips} s-flex jc-fe`}>
                    Avg. round-trip price per passenger
                </div>
                <Divider sx={{ borderStyle: 'dashed' , my: 1.5 }} />
                <div className={styles.details}>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                        <span>Adult Ticket </span>
                        <span>US$409</span>
                    </div>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                        <span>Fare  </span>
                        <span>US$390</span>
                    </div>
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue}`}>
                        <span>Taxes & fees </span>
                        <span>US$20</span>
                    </div>
                    <Divider sx={{ borderStyle: 'dashed' , my: 1.5 }} />
                    <div className={`s-flex jc-bt ai-ct ${styles.detailsValue} ${styles.detailsValueWeight}`}>
                        <span>Round-trip Total</span>
                        <span>US$409</span>
                    </div>
                </div>
            </div>
        </div>
    )
})

const FareCardsSlider = memo(() => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 2.6,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box position="relative" px={0} py={.2} className={styles.fareCardsSlider} >
            <Slider {...settings}>
                {fareData.map((fare, index) => (
                    <Box key={index} sx={{width: 320}}>
                        <Card sx={{ width: 319, height: 390, borderRadius: '4px', boxShadow: 0 }}>
                            <CardContent>
                                <Typography fontWeight="bold" fontSize="1.6rem" gutterBottom>{fare.title}</Typography>
                                <Divider sx={{ my: 1.5 }} />

                                <Typography fontWeight="bold" fontSize="1.1rem" mt={1}>Baggage</Typography>
                                {fare.baggage.map((item, i) => (
                                    <Typography key={i} variant="body2" className={styles.detailText} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 , fontSize: 13 }}>
                                        {item.icon}
                                        <span className={styles.texts} dangerouslySetInnerHTML={{
                                            __html: item.text
                                        }}>
                                        </span>
                                    </Typography>
                                ))}

                                <Divider sx={{ my: 1.5 }} />

                                <Typography fontWeight="bold" fontSize="1.1rem">Fare Rules</Typography>
                                {fare.rules.map((rule, i) => (
                                    <Typography key={i} variant="body2" className={styles.detailText} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 , fontSize: 13 }}>
                                        <AccessTimeIcon sx={{ fontSize: 16, color: '#00b894', mr: 0.5 }} />
                                        <span className={styles.texts} dangerouslySetInnerHTML={{
                                            __html: rule
                                        }} />
                                    </Typography>
                                ))}

                                <Box mt={2}>
                                    <HtmlTooltip placement="top" sx={{
                                        width: 300,
                                        'MuiTooltip-tooltip':{
                                            padding: 'var(--pm-16)',
                                        }
                                    }} title={
                                        <PriceDetail  />
                                    }>
                                        <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{fontSize: 20 , '&:hover':{
                                                textDecoration: 'underline',
                                                cursor: 'help'
                                            }}}>US${fare.price}</Typography>
                                    </HtmlTooltip>
                                    <Typography variant="caption" color="text.secondary" ml={1} sx={{fontSize: 14}}>Round-trip</Typography>
                                </Box>

                                <Button
                                    variant='contained'
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mt: 4,
                                        backgroundColor: 'var(--active-color)',
                                        fontSize:16,
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#264fd3' },
                                    }}
                                >
                                    Select
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Slider>
            <div className={`${styles.fareCardsTips} s-flex ai-ct`}>
                <img src="https://static.tripcdn.com/packages/flight/static-image-online/latest/flight_v2/hotel_cross/pic_popup_small.png" alt=""/>
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
