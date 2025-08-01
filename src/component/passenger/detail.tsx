import React, {Fragment, memo, type ReactElement, useCallback, useMemo, useRef, useState} from "react";
import styles from './styles.module.less'
import {
    Alert,
    Button,
    Divider,
    Grid,
    Snackbar, type SnackbarCloseReason, Step, StepLabel, Stepper,
    Typography
} from "@mui/material";
import type {OrderCreate, PriceSummary} from '@/types/order.ts'
import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";

import PassengerForm from "./passengerForm.tsx";
import ContactForm from './ContactForm.tsx'
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import CardCom from "@/component/passenger/cardCom.tsx";
import {calculateTotalPriceSummary} from "@/utils/order.ts";
import {orderCreateAgent} from "@/utils/request/agetn.ts";

import checkIn from "@/assets/checkIn.png_.webp"
import carryOn from "@/assets/carryOn.png_.webp"
import personal_no from "@/assets/personal_no.png_.webp"
import {useNavigate} from "react-router";
import {resetChoose} from "@/store/orderInfo.ts";


const NextStep = memo(({paySubmit,pirceResult}:{
    paySubmit:() => void
    pirceResult:PriceSummary
}) => {
    const resultAir = useSelector((state: RootState) => state.ordersInfo.airChoose.result)
    const payNow = () => {
        paySubmit()
    }


    return (
        <div className={styles.nextContainer}>
            <div className={styles.payContainer}>
                <div className={styles.commonBox}>
                    <div className={`${styles.payPrice} s-flex jc-bt ai-ct`}>
                        <div className={styles.payPriceLabels}>Total</div>
                        <div className={styles.payPricevalue}>{resultAir?.currency}${pirceResult.totalPrice}</div>
                    </div>
                    <Button type="submit" sx={{
                        backgroundColor: 'var(--active-color)',
                        color:'var(--vt-c-white)',
                        fontWeight: 'bold',
                        fontSize: 18
                    }} fullWidth onClick={payNow}>Pay Now</Button>
                </div>
            </div>
            <div className={`${styles.simple} s-flex ai-ct jc-ct`}>
                <div className={`${styles.simpleli} s-flex ai-ct`}>
                    <img src="https://ak-d.tripcdn.com/images/05S4r12000ceoxeo136F7.png" alt=""/>
                    <span>Award-winning</span>
                </div>
                <div className={`${styles.simpleli} s-flex ai-ct`}>
                    <img src="https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png" alt=""/>
                    <span>Support in approx. 30s</span>
                </div>
                <div className={`${styles.simpleli} s-flex ai-ct`}>
                    <img src="https://ak-d.tripcdn.com/images/0AS5x120008whk01q784B.png" alt=""/>
                    <span>Rewards for booking</span>
                </div>
            </div>

        </div>

    )
})

const Detail = memo(() => {
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const passengers = useSelector((state: RootState)=> state.ordersInfo.passengers)
    const contacts = useSelector((state: RootState)=> state.ordersInfo.contacts)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const targetRef = useRef<HTMLDivElement>(null)
    const scrollToTarget = () => {
        if (targetRef.current) {
            const offsetTop = targetRef.current.offsetTop
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            })
        }
    }

    const passengersRef = useRef<{
        submit: () => Promise<boolean>;
    }>(null)

    const [open, setOpen] = useState(false)
    const [snackbarCom, setSnackbarCom] = useState<ReactElement>()

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }


    const handlepaySubmit = useCallback(async () => {
        let passengerResult:boolean
        try {
            if(!passengersRef.current) return false
            passengerResult = await passengersRef.current.submit()
        } catch {
            scrollToTarget()
            setOpen(true);
            setSnackbarCom(
                <Alert severity="error" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                    Please fill in the passenger information
                </Alert>
            );
            return;
        }
        if (!passengerResult) return false

        // 对每种 passengerType 进行校验
        const mismatch = query.travelers.find(traveler => {
            const expected = traveler.passengerCount;
            const actual = passengers.filter(p => p.passengerType === traveler.passengerType).length;
            return actual !== expected;
        });

        if (mismatch) {
            setOpen(true);
            setSnackbarCom(
                <Alert severity="error" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                    Please select {mismatch.passengerCount} {mismatch.passengerType.toUpperCase()} passenger(s)
                </Alert>
            );
            return;
        }
        const newTravelers = query.travelers.filter(traveler => traveler.passengerCount>0)

        const result = {
            ...airChoose,
            request:{
                ...query,
                travelers:newTravelers
            },
            shuttleNumber:'',
            tLimit:'',
            remarks:'',
            passengers:passengers,
            contacts
        } as OrderCreate
        orderCreateAgent(result).then(res => {
            if(res.succeed){
                setOpen(true);
                setSnackbarCom(
                    <Alert severity="success" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                        {'Order created successfully'}
                    </Alert>
                );
                backOrder(res.response.orderNumber)
                //
                // navigate(`/mine/orderDetail/${res.response.orderNumber}`)
            }else{
                setOpen(true);
                setSnackbarCom(
                    <Alert severity="error" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                        {res.errorMessage}
                    </Alert>
                );
            }
        }).catch(() => {
            setOpen(true);
            setSnackbarCom(
                <Alert severity="error" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                    {'Interface error'}
                </Alert>
            );
        })
    },[query,airChoose,contacts]) // 条件

    const backOrder = (orderid:string) => {
        const referrer = document.referrer
        if(referrer){
            const origin = new URL(referrer).origin;
            window.parent.postMessage({
                type:'orderPaySuccess',
                data:{orderid}
            },origin)
        }

        dispatch(resetChoose())
        setTimeout(() => {
            navigate('/')
        },500)
    }

    const pirceResult = useMemo(() => {
        if(!airChoose.result) return null
        return calculateTotalPriceSummary(airChoose.result.itineraries,query.travelers)
    },[airChoose,query.travelers])

    const luggages = useMemo(() => {
        if (!airChoose.result) return [];

        return airChoose.result.itineraries.map(itinerarie => {
            const found = itinerarie.amounts.find(amount => amount.luggages && amount.luggages.length > 0);
            return found?.luggages || [];
        });
    }, [airChoose.result]);


    return (
        <div className={`${styles.detailContainer} s-flex flex-dir`}>
            <div className={styles.detailHeader}>
                <div className={styles.wContainer100}>
                    <div className={styles.setpContainer}>
                        <Stepper activeStep={0} sx={{
                            width: '100%',
                            '.MuiSvgIcon-root': {
                                width: '1.4em',
                                height: '1.4em',
                                '&.Mui-active':{
                                    color: 'var(--active-color)',
                                },
                                '.MuiStepIcon-text':{
                                    fontSize: 12,
                                }
                            },
                            '.MuiStepLabel-iconContainer,.MuiStep-root':{
                                p:0
                            },
                            '.MuiStepConnector-line':{
                                borderWidth: 4,
                                borderImage: 'linear-gradient(to right, var(--active-color) 50%, var(--put-border-color) 50%) 1 !important'
                            }
                        }}>
                            <Step>
                                <StepLabel />
                            </Step>
                            <Step>
                                <StepLabel />
                            </Step>
                        </Stepper>
                        <div className={`s-flex jc-bt ai-ct`}>
                            <Typography fontWeight={400} fontSize={14} color={'var(--active-color)'}>Fill in your info</Typography>
                            <Typography fontWeight={400} fontSize={14} color={'var(--text-color)'}>Finalize your payment</Typography>
                        </div>
                    </div>
                    <div className={`s-flex jc-bt`}>
                        <div className={`${styles.gap} ${styles.wContainer}`}>
                            <Grid container spacing={2}>
                                {
                                    !!airChoose.result && airChoose.result.itineraries.map((itinerarie,itinerarieIndex) => (
                                        <Grid size={6} key={itinerarie.itineraryKey}>
                                            <FirportInfomation segments={itinerarie.segments} labelPostion={((airChoose.result!.itineraries.length - 1) > itinerarieIndex) ? 'Depart':'Return'} />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                            {/*<Passenger />*/}
                        </div>
                        <div>
                            <div className={styles.cardCom}>
                                {
                                    pirceResult ? <CardCom pirceResult={pirceResult} /> : <></>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className={`${styles.leftDetail}`}>
                <div className={`${styles.wContainer} s-flex flex-dir`} ref={targetRef}>
                    <PassengerForm ref={passengersRef} />
                    <ContactForm />
                    <div className={styles.package}>
                        <div className={styles.packgaeTitle}>
                            Additional Baggage Allowanc
                        </div>
                        <div className={styles.commonBox}>
                            <div className={styles.packageContent}>
                                <Grid container spacing={2}>
                                    <Grid size={3}></Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src={personal_no} alt=""/>
                                            </div>
                                            <div className={styles.packageliNames}>Personal Item</div>

                                        </div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src={carryOn} alt=""/>
                                            </div>
                                            <div className={styles.packageliNames}>Carry-on baggage</div>


                                        </div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src={checkIn} alt=""/>
                                            </div>
                                            <div className={styles.packageliNames}>Checked baggage</div>

                                        </div>
                                    </Grid>
                                </Grid>
                                <Divider sx={{
                                    my:'20px'
                                }} />
                                {
                                    airChoose.result ? airChoose.result.itineraries.map((itinerarie, index) => {
                                        const {segments} = itinerarie;
                                        const handLuggage = luggages[index]?.find(l => l.luggageType === 'hand');
                                        const carryLuggage = luggages[index]?.find(l => l.luggageType === 'carry');
                                        const checkedLuggage = luggages[index]?.find(l => l.luggageType === 'checked');


                                        // 处理城市显示逻辑
                                        let cityText = '';
                                        if (segments.length === 1) {
                                            cityText = `${segments[0].departureAirport} - ${segments[0].arrivalAirport}`;
                                        } else if (segments.length > 1) {
                                            // 多段航班：起点 + 所有中间到达点
                                            const stops = [
                                                segments[0].departureAirport,
                                                ...segments.map(seg => seg.arrivalAirport)
                                            ];
                                            cityText = stops.join(' - ');
                                        }

                                        return (
                                            <Fragment key={index}>
                                                <Grid container spacing={2}>
                                                    <Grid size={12}>
                                                        <div className={styles.cityText}>{cityText}</div>
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <Grid container>
                                                            <Grid size={3}>
                                                                <div className={styles.cityDetail}>Passenger
                                                                </div>
                                                            </Grid>
                                                            <Grid size={3}>
                                                                <div className={styles.cityDetailSp}>{handLuggage?.luggageNotes || '--'}</div>
                                                            </Grid>
                                                            <Grid size={3}>
                                                                <div className={styles.cityDetailSp}>{carryLuggage?.luggageNotes || '--'}</div>
                                                            </Grid>
                                                            <Grid size={3}>
                                                                <div className={styles.cityDetailSp}>{checkedLuggage?.luggageNotes || '--'}</div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Divider sx={{
                                                    my: '20px'
                                                }}/>
                                            </Fragment>
                                        );
                                    }) : <></>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        pirceResult ? <NextStep pirceResult={pirceResult} paySubmit={handlepaySubmit} /> : <></>
                    }
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical:'top', horizontal:'right' }}
                      onClose={handleClose}>
                {snackbarCom}
            </Snackbar>
        </div>
    )
})

export default Detail;
