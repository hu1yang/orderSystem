import {memo, useRef, useState} from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Link,
    Snackbar,
    type SnackbarCloseReason,
    Typography
} from "@mui/material";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import styles from './styles.module.less'

const FlightCom = memo(({
                            type,data
                        }:{
    type:'Depart'|'Return'
}) => {
    return (
        <div className={styles.flightCom}>
            <div className={`${styles.flightComTitle} s-flex ai-ct`}>
                <div className={styles.tipX}>
                    <span>{type}</span>
                </div>
                <span>{data.date}</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{data.route}</span>
            </div>
            <div className={styles.flightDetail}>
                <Grid container spacing={2}>
                    <Grid size={6.5}>
                        <div className={styles.tripBox}>
                            <div className={`${styles.tripli} s-flex ai-ct`}>
                                <div className={styles.timer}>{data.departure_time}</div>
                                <div className={styles.info}>{data.departure_airport} {data.departure_airport_full}</div>
                            </div>
                            <div className={styles.timeConsuming}>{data.duration}</div>
                            <div className={`${styles.tripli} s-flex ai-ct`}>
                                <div className={styles.timer}>{data.arrival_time}</div>
                                <div className={styles.info}>{data.arrival_airport_full}</div>
                            </div>
                            <div className={styles.lines}></div>
                        </div>

                    </Grid>
                    <Grid size={5.5}>
                        <div className={styles.airT}>
                            <div className={`${styles.titles} s-flex ai-ct`}>
                                <img src="https://ak-s.tripcdn.com/modules/flight/airline-logo/mu.eec5d02ff22677659574d07e6ab0943e.png" alt=""/>
                                <span>{data.airline} {data.flight_number}</span>
                            </div>
                            <div className={`${styles.airTtips} s-flex flex-wrap`}>
                                <div className={styles.airl}>{data.class}</div>
                                <div className={styles.airl}>{data.aircraft}</div>
                                <div className={styles.airl}>Meal</div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
})

const Flight = memo(() => {
    return (
        <div className={styles.flightContent}>
            <div className={styles.flightTitle}>Flight Details</div>
            <div className={styles.flightBox}>
                <div className={styles.flightTips}>All times are in local time</div>
                <FlightCom type={'Depart'} data={
                    {
                        "trip_type": "depart",
                        "date": "Fri, May 30",
                        "route": "Beijing - Shanghai",
                        "departure_time": "07:00",
                        "arrival_time": "09:15",
                        "departure_airport": "PKX",
                        "departure_airport_full": "Beijing Daxing Intl.",
                        "arrival_airport": "SHA",
                        "arrival_airport_full": "Shanghai Hongqiao Intl. T2",
                        "duration": "2h 15m",
                        "airline": "China Eastern Airlines",
                        "flight_number": "MU6865",
                        "class": "Economy class",
                        "aircraft": "Airbus A320 (Mid-sized)",
                        "meal": true
                    }
                } />
                <FlightCom type={'Return'} data={
                    {
                        "trip_type": "return",
                        "date": "Sat, May 31",
                        "route": "Shanghai - Beijing",
                        "departure_time": "19:00",
                        "arrival_time": "21:15",
                        "departure_airport": "SHA",
                        "departure_airport_full": "Shanghai Hongqiao Intl. T2",
                        "arrival_airport": "PEK",
                        "arrival_airport_full": "Beijing Capital Intl. T2",
                        "duration": "2h 15m",
                        "airline": "China Eastern Airlines",
                        "flight_number": "MU5123",
                        "class": "Economy class",
                        "aircraft": "Airbus A330 (Large)",
                        "meal": true
                    }
                } />
            </div>

        </div>
    )
})

const Passenger = memo(() => {
    return (
        <div className={styles.passengerContent}>
            <div className={styles.passengerTitle}>Passenger Information</div>
            <div className={styles.passengerBox}>
                <div className={styles.passengerLi}>
                    <div className={`${styles.passengerName} s-flex ai-ct`}>
                        <span>Jesen</span>
                        <div className={styles.write}>
                            <span>Request Update</span>
                            <DriveFileRenameOutlineIcon sx={{
                                color: 'var(--active-color)',
                                fontSize: 18
                            }} />
                        </div>
                    </div>
                    <div className={styles.liBox}>
                        <div className={`${styles.lis} s-flex ai-ct`}>
                            <div className={styles.label}>
                                <span>ID type: </span>
                            </div>
                            <div className={styles.values}>
                                <span>Mainland Chinese ID Card</span>
                            </div>
                        </div>
                        <div className={`${styles.lis} s-flex ai-ct`}>
                            <div className={styles.label}>
                                <span>ID number: </span>
                            </div>
                            <div className={styles.values}>
                                <span>12314354351231</span>
                            </div>

                        </div>
                        <div className={`${styles.lis} s-flex ai-ct`}>
                            <div className={styles.label}>
                                <span>Nationality: </span>
                            </div>
                            <div className={styles.values}>
                                <span>China</span>
                            </div>

                        </div>
                        <div className={`${styles.lis} s-flex ai-ct`}>
                            <div className={styles.label}>
                                <span>Gender: </span>
                            </div>
                            <div className={styles.values}>
                                <span>Male | Adult</span>
                            </div>

                        </div>
                        <div className={`${styles.lis} s-flex ai-ct`}>
                            <div className={styles.label}>
                                <span>Date of birth: </span>
                            </div>
                            <div className={styles.values}>
                                <span>Aug 24, 1998</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

const Contact = memo(() => {
    return (
        <div className={styles.passengerContent}>
            <div className={styles.passengerTitle}>Contact Information</div>
            <div className={styles.passengerBox}>
                <div className={styles.passengerLi}>
                    <div className={`${styles.passengerName} s-flex ai-ct`}>
                        <span>Jesen</span>
                    </div>
                    <div className={styles.liBox}>
                        <div className={`${styles.lis} s-flex ai-ct`} style={{marginTop: 'var(--pm-16)'}}>
                            <div className={styles.label} style={{maxWidth: '80px'}}>
                                <span>Phone: </span>
                            </div>
                            <div className={styles.values}>
                                <span>+86 18391283710</span>
                            </div>
                        </div>
                        <div className={`${styles.lis} s-flex ai-ct`} style={{marginTop: 'var(--pm-16)'}}>
                            <div className={styles.label} style={{maxWidth: '80px'}}>
                                <span>Email: </span>
                            </div>
                            <div className={styles.values}>
                                <span>test@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

const OrderDetail = () => {
    const detailRef = useRef<HTMLDivElement|null>(null)
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<'awaiting'|'canceled'|'success'>('awaiting')

    const setPay = () => {
        console.log(detailRef.current)
        if(detailRef.current){
            detailRef.current.style.setProperty('--status-color', 'var(--active-color)');
        }
        setStatus('success')
        setOpen(true)
    }

    const handleClose = (_event?: React.SyntheticEvent | Event,
                         reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    return (
        <div className={styles.orderDetailContainer} ref={detailRef}>
            <div className={`${styles.orderDetailMain} s-flex ai-fs jc-bt`}>
                <div className={`${styles.leftContent} flex-1`}>
                    <div className={styles.orderStatus}>
                        <div className={`${styles.orderStatusT}`}>
                            {
                                status === 'awaiting'? 'Awaiting Payment' : 'Payment successful'
                            }
                        </div>
                        <div className={styles.orderStatusP}>
                            <p>Please complete payment before 16:57, May 26, 2025</p>
                            <p>Booking No. 1688890540449587</p>
                        </div>
                        {
                            status === 'awaiting' && <>
                                <div className={`${styles.orderPay} s-flex flex-dir ai-fe`}>
                                    <div>
                                        <Button variant="contained" sx={{
                                            backgroundColor: 'rgb(255, 149, 0)',
                                            boxShadow: 'none',
                                            borderRadius: 0,
                                        }} onClick={setPay}>Pay</Button>
                                        <Button variant="outlined" sx={{
                                            borderColor: 'var(--active-color)',
                                            boxShadow: 'none',
                                            borderRadius: 0,
                                            ml: 'var(--pm-16)'
                                        }}>Cancel Booking</Button>
                                    </div>
                                    <Typography sx={{
                                        fontSize: 12,
                                        mt: '5px',
                                        color: 'var(--text-color)'
                                    }}>
                                        Stay informed and never miss a flight! Download
                                        <Link href="#" underline="hover">
                                            our mobile app
                                        </Link>
                                        for instant updates.
                                    </Typography>
                                </div>
                                    <div className={`${styles.orderTips} s-flex ai-ct`}>
                                    <span>
                                        <i>[Penalties for Skipping a Flight in Your Booking]</i>According to the airline's policy, skipping flights is not permitted for some flights in your booking. If you skip a flight that is subject to these restrictions, you may be denied boarding for subsequent flights or charged additional fees.
                                        <Link href="#" underline="hover">
                                            View Details
                                        </Link>
                                    </span>

                                </div>
                            </>
                        }

                    </div>
                    <Flight />
                    <Passenger />
                    <Contact />

                </div>
                <div className={styles.detailInfo}>
                    <Card sx={{
                        mb:'var(--pm-16)',
                        cursor: 'pointer',
                    }}>
                        <CardHeader title={
                            <div className={`s-flex ai-ct jc-bt`}>
                                <div className={styles.priceT}>Total Amount</div>
                                <div className={styles.priceV}>US$159.30</div>
                            </div>
                        } />
                        <CardContent sx={{
                            pt:0
                        }}>
                            <Divider variant="middle" flexItem sx={{
                                m:0,
                            }} />
                            <div className={styles.priceBox}>
                                <div className={`${styles.priceBTitle} s-flex ai-fs jc-bt`}>
                                    <div className={styles.bookingTitle}>
                                        <span>Booking Total</span>
                                        <p>16:42, May 26, 2025</p>
                                    </div>
                                    <div className={styles.price}>US$159.30</div>
                                </div>
                                <div className={styles.tips}>
                                    Please note that the payment method cannot be changed once the transaction has been completed
                                </div>
                                <div className={styles.about}>
                                    <div className={`${styles.aboutF} s-flex jc-bt ai-ct`}>
                                        <span>Adults</span>
                                        <span>US$159.30 × 1</span>
                                    </div>
                                    <div className={`${styles.aboutFC} s-flex jc-bt ai-ct`}>
                                        <span>Ticket fare</span>
                                        <span>US$139.70 × 1</span>
                                    </div>
                                    <div className={`${styles.aboutFC} s-flex jc-bt ai-ct`}>
                                        <span>Civil aviation development fund</span>
                                        <span>US$14.00 × 1</span>
                                    </div>
                                    <div className={`${styles.aboutFC} s-flex jc-bt ai-ct`}>
                                        <span>Fuel surcharge</span>
                                        <span>US$5.60 × 1</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                    </Card>
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical:'top', horizontal:'right' }}
                      onClose={handleClose}>
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' , fontSize: 18 }}
                >
                    Payment successful!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default OrderDetail;
