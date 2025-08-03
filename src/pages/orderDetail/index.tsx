import React, {memo, useEffect, useMemo, useRef, useState} from "react";
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
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import CardCom from "@/component/passenger/cardCom.tsx";
import {calculateTotalPriceSummary} from "@/utils/order.ts";
import stylesPass from '@/component/passenger/styles.module.less'
import {formatDateToShortString} from "@/utils/public.ts";
import type {Dayjs} from "dayjs";
import {useNavigate, useParams, useSearchParams} from "react-router";
import {paymentOrderAgent} from "@/utils/request/agetn.ts";
import {resetChoose} from "@/store/orderInfo.ts";

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
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    return (
        <div className={styles.flightContent}>
            <div className={styles.flightTitle}>Flight Details</div>
            <div className={styles.flightBox}>
                <div className={styles.flightTips}>All times are in local time</div>
                <Grid container spacing={2}>
                    {
                        !!airChoose.result && airChoose.result.itineraries.map((itinerarie,itinerarieIndex) => (
                            <Grid size={6} key={itinerarie.itineraryKey}>
                                <FirportInfomation segments={itinerarie.segments} labelPostion={((airChoose.result!.itineraries.length - 1) > itinerarieIndex) ? 'Depart':'Return'} />
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
        </div>
    )
})

const Passenger = memo(() => {
    const passengers = useSelector((state: RootState) => state.ordersInfo.passengers)


    return (
        <div className={styles.passengerContent}>
            <div className={styles.passengerTitle}>Passenger Information</div>
            <div className={styles.passengerBox}>
                {
                    passengers.map(passenger => (
                        <div key={passenger.idNumber} className={styles.passengerLi}>
                            <div className={`${styles.passengerName} s-flex ai-ct`}>
                                <span>{passenger.title} {passenger.fullName}</span>
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
                                        <span>{passenger.idNumber}</span>
                                    </div>

                                </div>
                                <div className={`${styles.lis} s-flex ai-ct`}>
                                    <div className={styles.label}>
                                        <span>Nationality: </span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{passenger.idCountry}</span>
                                    </div>

                                </div>
                                <div className={`${styles.lis} s-flex ai-ct`}>
                                    <div className={styles.label}>
                                        <span>Gender: </span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{passenger.passengerSexType} | {passenger.passengerType}</span>
                                    </div>

                                </div>
                                <div className={`${styles.lis} s-flex ai-ct`}>
                                    <div className={styles.label}>
                                        <span>Date of birth: </span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{formatDateToShortString(passenger.birthday as Dayjs)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
})

const Contact = memo(() => {
    const contacts = useSelector((state: RootState) => state.ordersInfo.contacts)
    return (
        <div className={styles.passengerContent}>
            <div className={styles.passengerTitle}>Contact Information</div>
            <div className={styles.passengerBox}>
                {
                    contacts.map((contact,index) => (
                        <div className={styles.passengerLi} key={index}>
                            <div className={`${styles.passengerName} s-flex ai-ct`}>
                                <span>{contact.contactName}</span>
                            </div>
                            <div className={styles.liBox}>
                                <div className={`${styles.lis} s-flex ai-ct`} style={{marginTop: 'var(--pm-16)'}}>
                                    <div className={styles.label} style={{maxWidth: '80px'}}>
                                        <span>Phone: </span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{contact.phoneNumber}</span>
                                    </div>
                                </div>
                                <div className={`${styles.lis} s-flex ai-ct`} style={{marginTop: 'var(--pm-16)'}}>
                                    <div className={styles.label} style={{maxWidth: '80px'}}>
                                        <span>Email: </span>
                                    </div>
                                    <div className={styles.values}>
                                        <span>{contact.emailAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
})

const OrderDetail = () => {
    const {payid} = useParams()
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)


    const [payLoad, setPayLoad] = useState(false)

    const detailRef = useRef<HTMLDivElement|null>(null)
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<'awaiting'|'canceled'|'success'>('awaiting')

    useEffect(() => {
        if(!payid){
            navigate('/')
        }
    }, [payid]);

    const pirceResult = useMemo(() => {
        if(!airChoose.result) return null
        return calculateTotalPriceSummary(airChoose.result.itineraries,query.travelers)
    },[airChoose,query.travelers])

    const setPay = () => {
        if(payLoad) return
        setPayLoad(true)
        paymentOrderAgent(payid as string).then(res => {
            if(res.succeed){
                if(detailRef.current){
                    detailRef.current.style.setProperty('--status-color', 'var(--active-color)');
                }
                setStatus('success')
                setOpen(true)
                backOrder()
            }
        })
    }

    const cancelPay = () => {

    }

    const backOrder = () => {
        const referrer = document.referrer
        if(referrer){
            const origin = new URL(referrer).origin;
            window.parent.postMessage({
                type:'orderPaySuccess',
                data:{orderid:payid}
            },origin)
        }

        setTimeout(() => {
            navigate('/')
        },500)
    }

    const handleClose = (_event?: React.SyntheticEvent | Event,
                         reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') {
            return;
        }
        backOrder()
        setOpen(false);
    }

    return (
        <div className={styles.orderDetailContainer} ref={detailRef}>
            <div className={`${styles.orderDetailMain} s-flex ai-fs jc-bt`}>
                <div className={`${styles.leftContent}`}>
                    <div className={styles.orderStatus}>
                        <div className={`${styles.orderStatusT}`}>
                            {
                                status === 'awaiting'? 'Awaiting Payment' : 'Payment successful'
                            }
                        </div>
                        <div className={styles.orderStatusP}>
                            {/*<p>Please complete payment before 16:57, May 26, 2025</p>*/}
                            <p>Booking No. {payid}</p>
                        </div>
                        {
                            status === 'awaiting' && <>
                                <div className={`${styles.orderPay} s-flex flex-dir ai-fe`}>
                                    <div>
                                        <Button variant="contained" loading={payLoad} sx={{
                                            backgroundColor: 'rgb(255, 149, 0)',
                                            boxShadow: 'none',
                                            borderRadius: 0,
                                            width: '120px',
                                            fontSize: '1.2rem'
                                        }} onClick={setPay}>Pay</Button>
                                        <Button variant="outlined" sx={{
                                            borderColor: 'var(--active-color)',
                                            boxShadow: 'none',
                                            width: '120px',
                                            borderRadius: 0,
                                            fontSize: '1.2rem',
                                            ml: 'var(--pm-16)'
                                        }} onClick={cancelPay}>Cancel</Button>
                                    </div>

                                </div>
                            </>
                        }

                    </div>
                    <Flight />
                    <Passenger />
                    <Contact />

                </div>
                <div className={stylesPass.cardCom}>
                    {
                        pirceResult ? <CardCom pirceResult={pirceResult} /> : <></>
                    }
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
