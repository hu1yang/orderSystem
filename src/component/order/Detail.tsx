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
import {memo} from "react";

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
            border: '1px solid #dadfe6',
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
            border: '1px solid #dadfe6',
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
                                    <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{fontSize: 20}}>US${fare.price}</Typography>
                                    <Typography variant="caption" color="text.secondary" ml={1} sx={{fontSize: 14}}>Round-trip</Typography>
                                </Box>

                                <Button
                                    variant='contained'
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mt: 4,
                                        backgroundColor: '#3264ff',
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
