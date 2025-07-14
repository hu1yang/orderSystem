import React, {Fragment, memo, type ReactElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styles from './styles.module.less'
import {
    Alert,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Snackbar, type SnackbarCloseReason, Step, StepLabel, Stepper,
    Typography
} from "@mui/material";
import type {OrderCreate, PriceSummary} from '@/types/order.ts'
import type {RootState} from "@/store";
import {useSelector} from "react-redux";

import PassengerForm from "./passengerForm.tsx";
import ContactForm from './ContactForm.tsx'
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import CardCom from "@/component/passenger/cardCom.tsx";
import {calculateTotalPriceSummary} from "@/utils/order.ts";
import {orderCreateAgent, paymentOrderAgent} from "@/utils/request/agetn.ts";

import checkIn from "@/assets/checkIn.png_.webp"
import carryOn from "@/assets/carryOn.png_.webp"
import personal_no from "@/assets/personal_no.png_.webp"


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
    const selectPassengers = useSelector((state: RootState)=> state.ordersInfo.selectPassengers)
    const contacts = useSelector((state: RootState)=> state.ordersInfo.contacts)


    const [open, setOpen] = useState(false)
    const [snackbarCom, setSnackbarCom] = useState<ReactElement>()
    const [dialogVisible, setDialogVisible] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    const choosePassengers = useMemo(() => {
        return passengers.filter(passenger => selectPassengers.includes(passenger.idNumber))
    }, [passengers,selectPassengers]);



    const handlepaySubmit = useCallback(() => {
        const totalCount = query.travelers.reduce((sum, item) => sum + item.passengerCount, 0);

        if (totalCount !== choosePassengers.length) {
            setOpen(true);
            setSnackbarCom(
                <Alert severity="error" variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                    Please select all passengers
                </Alert>
            );
            return;
        }

        // 对每种 passengerType 进行校验
        const mismatch = query.travelers.find(traveler => {
            const expected = traveler.passengerCount;
            const actual = choosePassengers.filter(p => p.passengerType === traveler.passengerType).length;
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
            passengers:choosePassengers,
            contacts
        } as OrderCreate
        orderCreateAgent(result).then(res => {
            if(res.succeed){
                setDialogVisible(true)
                setOrderNumber(res.response.orderNumber)

            }
        })
    },[choosePassengers,query,airChoose,contacts]) // 条件

    const handleCloseVisible = () => {
        setDialogVisible(false)
    }
    const handlePayment = () => {
        paymentOrderAgent(orderNumber).then(res => {
            if(res.succeed){
                setOpen(true)
                setSnackbarCom(<Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' , fontSize: 18 }}
                >
                    Payment successful! Redirecting soon~
                </Alert>)

                setDialogVisible(false)

                setTimeout(() => {
                    history.go(-1)
                },1000)
            }
        })
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
                <div className={`${styles.wContainer} s-flex flex-dir`}>
                    <PassengerForm />
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
                                            <div className={styles.packageliTips}>
                                                View Details
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src={carryOn} alt=""/>
                                            </div>
                                            <div className={styles.packageliNames}>Carry-on baggage</div>

                                            <div className={styles.packageliTips}>
                                                (20 × 40 × 55 cm)
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src={checkIn} alt=""/>
                                            </div>
                                            <div className={styles.packageliNames}>Checked baggage</div>
                                            <div className={styles.packageliTips}>
                                                (40 × 60 × 100 cm)
                                            </div>
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

                                                        {
                                                            choosePassengers.length ? choosePassengers.map((choosePassenger) => (
                                                                    <Grid container key={choosePassenger.idNumber}>
                                                                        <Grid size={3}>
                                                                            <div className={styles.cityDetail}>{choosePassenger.fullName}
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
                                                                )) :
                                                                <Grid container>
                                                                    <Grid size={3}>
                                                                        <div className={styles.cityDetail}>Passenger 1
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
                                                        }
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
                    {/*<div className={styles.cancellation}>*/}
                    {/*    <div className={styles.cancellationTitle}>Cancellation & Change Policies</div>*/}
                    {/*    <div className={styles.commonBox}>*/}
                    {/*        <div className={`${styles.cancellationli} s-flex ai-ct cursor-p`}>*/}
                    {/*            <span>Cancellation fee</span>*/}
                    {/*            <span>From US$14.00</span>*/}
                    {/*            <ChevronRightIcon sx={{fontSize: 22}} />*/}
                    {/*        </div>*/}
                    {/*        <div className={`${styles.cancellationli} s-flex ai-ct cursor-p`}>*/}
                    {/*            <span>Change fee</span>*/}
                    {/*            <span>From US$14.00</span>*/}
                    {/*            <ChevronRightIcon sx={{fontSize: 22}} />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                    {
                        pirceResult ? <NextStep pirceResult={pirceResult} paySubmit={handlepaySubmit} /> : <></>
                    }
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical:'top', horizontal:'right' }}
                      onClose={handleClose}>
                {snackbarCom}
            </Snackbar>
            <Dialog
                open={dialogVisible}
                onClose={handleCloseVisible}
                aria-labelledby="alert-dialog-title-payment"
                aria-describedby="alert-dialog-description-payment"
            >
                <DialogTitle id="alert-dialog-title-payment">
                    {"The order is successfully placed, please pay in time"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please click Pay to complete this order
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVisible}>Disagree</Button>
                    <Button onClick={handlePayment} autoFocus>
                        Payment
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})

export default Detail;
