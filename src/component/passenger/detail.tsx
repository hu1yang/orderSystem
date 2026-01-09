import React, {Fragment, memo, type ReactElement, useCallback, useMemo, useRef, useState} from "react";
import styles from './styles.module.less'
import {
    Alert, Box,
    Button, CircularProgress,
    Divider,
    Grid,
    Snackbar, type SnackbarCloseReason, Step, StepLabel, Stepper,
    Typography
} from "@mui/material";
import type { OrderCreate, Passenger, PriceSummary } from '@/types/order.ts'
import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";

import PassengerForm from "./passengerForm.tsx";
import ContactForm from './ContactForm.tsx'
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import CardCom from "@/component/passenger/cardCom.tsx";
import {calculateTotalPriceSummary} from "@/utils/order.ts";
import {orderCreateAgent} from "@/utils/request/agent.ts";

import checkIn from "@/assets/checkIn.png_.webp"
import carryOn from "@/assets/carryOn.png_.webp"
import personal_no from "@/assets/personal_no.png_.webp"
import {useNavigate} from "react-router";
import {setCreatedLoading, setPassengers} from "@/store/orderInfo.ts";
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import {useTranslation} from "react-i18next";


const NextStep = memo(({paySubmit,pirceResult}:{
    paySubmit:() => void
    pirceResult:PriceSummary
}) => {
    const {t} = useTranslation()

    const createdLoading = useSelector((state: RootState) => state.ordersInfo.createdLoading)
    const resultAir = useSelector((state: RootState) => state.ordersInfo.airChoose.result)
    const payNow = () => {
        paySubmit()
    }


    return (
        <div className={styles.nextContainer}>
            <div className={styles.payContainer}>
                <div className={styles.commonBox}>
                    <div className={`${styles.payPrice} s-flex jc-bt ai-ct`}>
                        <div className={styles.payPriceLabels}>{t('passenger.total')}</div>
                        <div className={styles.payPricevalue}>{resultAir?.currency}${pirceResult.totalPrice}</div>
                    </div>
                    <Button type="submit" loading={createdLoading} loadingPosition="end" sx={{
                        backgroundColor: 'var(--active-color)',
                        color:'var(--vt-c-white)',
                        fontWeight: 'bold',
                        fontSize: 18,
                        '&.MuiButton-loading': {
                            backgroundColor: 'var(--put-border-color)'
                        },
                    }} fullWidth onClick={payNow}>{t('passenger.bookingNow')}</Button>
                </div>
            </div>
        </div>

    )
})

const Detail = memo(() => {
    const { t } = useTranslation()

    const createdLoading = useSelector((state: RootState) => state.ordersInfo.createdLoading)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)
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
        submit: () => Promise<Passenger[]>;
    }>(null)
    const contactRef = useRef<{
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
        dispatch(setCreatedLoading(true))
        try {
            let passengers:Passenger[]
            try {
                if(!passengersRef.current) throw new Error('ref is missing')
                passengers = await passengersRef.current.submit()
            } catch {
                scrollToTarget()
                setError('error',t('passenger.fillPassengerInfo'))

                return;
            }
            try {
                if(!contactRef.current) throw new Error('ref is missing')
                await contactRef.current.submit()
            } catch {
                setError('error',t('passenger.fillContactInfo'))

                return;
            }


            // 对每种 passengerType 进行校验
            const mismatch = query.travelers.find(traveler => {
                const expected = traveler.passengerCount;
                const actual = passengers.filter(p => p.passengerType === traveler.passengerType).length;
                return actual !== expected;
            });

            if (mismatch) {
                setError('error',t('passenger.selectPassengerCount',{count:mismatch.passengerCount,type:mismatch.passengerType}))

                return;
            }
            const newTravelers = query.travelers.filter(traveler => traveler.passengerCount>0)
            dispatch(setPassengers(passengers))

            const result = {
                ...airChoose,
                request:{
                    ...query,
                    travelers:newTravelers
                },
                shuttleNumber:'',
                tLimit:'',
                remarks:'',
                passengers,
                contacts
            } as OrderCreate

            await orderCreateAgent(result).then(res => {
                if(res.succeed){
                    setError('success',t('passenger.orderCreatedSuccessfully'))
                    backOrder(res.response.orderNumber)
                    //
                    // navigate(`/mine/orderDetail/${res.response.orderNumber}`)
                }else{
                    setError('error',res.errorMessage)

                }
            }).catch(() => {
                setError('error',t('passenger.interfaceError'))

            })
        } finally {
            dispatch(setCreatedLoading(false))
        }

    },[query,airChoose,contacts])

    const backOrderNav = () => {
        navigate('/')
    }

    const backOrder = (orderid:string) => {
        const origin = new URL(location.origin).origin;
        window.parent.postMessage({
            type:'orderPaySuccess',
            data:{orderid}
        },origin)

        setTimeout(() => {
            backOrderNav()
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

    const setError = useCallback((type:'success'|'error',msg:string) => {
        setOpen(true);
        setSnackbarCom(
            <Alert severity={type} variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                {msg}
            </Alert>
        );
    },[open])
    return (
        <div className={`${styles.detailContainer} s-flex flex-dir`}>
            <div className={styles.detailHeader}>
                <div className={styles.wContainer100}>
                    <div className={styles.setpContainer}>
                        <Stepper activeStep={1} sx={{
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
                                // borderImage: 'linear-gradient(to right, var(--active-color) 50%, var(--put-border-color) 50%) 1 !important'
                            },
                            '.Mui-active .MuiStepConnector-line': {
                                borderColor: 'var(--active-color)',
                            },
                            '.Mui-completed': {
                                color: 'var(--active-color) !important',
                            }
                        }}>
                            <Step>
                                <StepLabel />
                            </Step>
                            <Step>
                                <StepLabel />
                            </Step>
                            <Step>
                                <StepLabel />
                            </Step>
                        </Stepper>
                        <div className={'s-flex'}>
                            <Typography className={'flex-1'} fontWeight={400} fontSize={14} color={'var(--active-color)'}>
                                {t('passenger.chooseFlight')}
                                <span className={`${styles.firportSet} cursor-p s-flex ai-ct`} onClick={backOrderNav}>
                                    <span>{t('passenger.changeFlight')}</span>
                                </span>
                            </Typography>
                            <Typography fontWeight={400} fontSize={14} color={'var(--active-color)'}>{t('passenger.chooseFlight')}</Typography>
                            <Typography className={'flex-1'} textAlign={'right'} fontWeight={400} fontSize={14} color={'var(--text-color)'}>{t('passenger.finalizePayment')}</Typography>
                        </div>
                    </div>
                    <div className={`s-flex jc-bt`}>
                        <div className={`${styles.gap} ${styles.wContainer}`}>
                            <Box component="section" sx={{ p: 2, border: '1px solid var(--put-border-color)',borderRadius:'var(--border-radius)' }}>
                                <Grid container spacing={2}>
                                {
                                    !!airChoose.result && airChoose.result.itineraries.map((itinerarie) => (
                                        <Grid size={12} key={itinerarie.itineraryKey}>
                                            <FirportInfomation segments={itinerarie.segments}
                                                           amounts={itinerarie.amounts ?? null} />
                                        </Grid>
                                    ))
                                }
                                </Grid>
                            </Box>
                            {/*<Passenger />*/}
                            <div className={`${styles.leftDetail}`}>
                                <div className={`${styles.wContainer} s-flex flex-dir`} ref={targetRef}>
                                    <PassengerForm ref={passengersRef} setErrorFnc={setError} />
                                    <ContactForm ref={contactRef} />
                                    <div className={styles.package}>
                                        <div className={styles.packgaeTitle}>
                                            {t('passenger.additionalBaggageAllowanc')}
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
                                                            <div className={styles.packageliNames}>{t('passenger.personalItem')}</div>

                                                        </div>
                                                    </Grid>
                                                    <Grid size={3}>
                                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                                <img src={carryOn} alt=""/>
                                                            </div>
                                                            <div className={styles.packageliNames}>{t('order.carryBagger')}</div>


                                                        </div>
                                                    </Grid>
                                                    <Grid size={3}>
                                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                                <img src={checkIn} alt=""/>
                                                            </div>
                                                            <div className={styles.packageliNames}>{t('order.checkedBagger')}</div>

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
                                                                                <div className={styles.cityDetail}>{t('passenger.passenger')}
                                                                                </div>
                                                                            </Grid>
                                                                            <Grid size={3}>
                                                                                <HtmlTooltip placement="top" disableHoverListener={!handLuggage} sx={{
                                                                                    '.MuiTooltip-tooltip': {
                                                                                        fontSize: "1.1rem",
                                                                                    }
                                                                                }} title={
                                                                                    <div className={styles.cityDetailSp}>{handLuggage ? handLuggage.luggageNotes : '--'}</div>
                                                                                }>
                                                                                    <div className={`${styles.cityDetailSp} cursor-p`}>{handLuggage ? `${handLuggage.luggageCount}${handLuggage.luggageSizeType}` : '--'}</div>
                                                                                </HtmlTooltip>
                                                                            </Grid>
                                                                            <Grid size={3}>
                                                                                <HtmlTooltip placement="top" disableHoverListener={!carryLuggage} sx={{
                                                                                    '.MuiTooltip-tooltip': {
                                                                                        fontSize: "1.1rem",
                                                                                    }
                                                                                }} title={
                                                                                    <div className={styles.cityDetailSp}>{carryLuggage ? carryLuggage.luggageNotes : '--'}</div>
                                                                                }>
                                                                                    <div className={`${styles.cityDetailSp} cursor-p`}>{carryLuggage ? `${carryLuggage.luggageCount}${carryLuggage.luggageSizeType}` : '--'}</div>
                                                                                </HtmlTooltip>
                                                                            </Grid>
                                                                            <Grid size={3}>
                                                                                <HtmlTooltip placement="top" disableHoverListener={!checkedLuggage} sx={{
                                                                                    '.MuiTooltip-tooltip': {
                                                                                        fontSize: "1.1rem",
                                                                                    }
                                                                                }} title={
                                                                                    <div className={styles.cityDetailSp}>{checkedLuggage ? checkedLuggage.luggageNotes : '--'}</div>
                                                                                }>
                                                                                    <div className={`${styles.cityDetailSp} cursor-p`}>{checkedLuggage ? `${checkedLuggage.luggageCount}${checkedLuggage.luggageSizeType}` : '--'}</div>
                                                                                </HtmlTooltip>
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

            <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical:'top', horizontal:'right' }}
                      onClose={handleClose}>
                {snackbarCom}
            </Snackbar>
            <Snackbar open={createdLoading} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity="success" icon={<CircularProgress size={20} color="inherit" />} variant="filled" sx={{ width: '100%', fontSize: 18 }}>
                    {t('passenger.orderCreation')}
                </Alert>
            </Snackbar>
        </div>
    )
})

export default Detail;
