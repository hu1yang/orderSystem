import {memo, useMemo, useRef, useState} from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import styles from './styles.module.less'
import {
    Alert,
    Button,
    Checkbox,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, FormControlLabel,
    Grid,
    Link, Snackbar, type SnackbarCloseReason, Step, StepLabel, Stepper,
    Typography
} from "@mui/material";
import type {IContact, OrderCreate, OrderPrice, Passenger as IPassenger, PriceSummary} from '@/types/order.ts'



import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



import PassengerForm from "./PassengerForm.tsx";
import ContactForm from './ContactForm.tsx'
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import {orderCreateAgent, paymentOrderAgent} from "@/utils/request/agetn.ts";
import {useNavigate} from "react-router";
import CardCom from "@/component/passenger/cardCom.tsx";
import {calculateTotalPriceSummary} from "@/utils/price.ts";



const NextStep = memo(({paySubmit,totalPrice}:{
    paySubmit:() => void
    totalPrice:PriceSummary
}) => {
    const resultAir = useSelector((state: RootState) => state.ordersInfo.airChoose.result)

    const [agree, setAgree] = useState(true)

    const handleSetAgree = () => {
        setAgree(!agree)
    }

    const payTo = () => {
        paySubmit()
    }


    return (
        <div className={styles.nextContainer}>
            <div className={styles.agreeContainer}>
                <FormControlLabel sx={{
                    '&.MuiFormControlLabel-root':{
                        alignItems:'flex-start',
                        '.MuiButtonBase-root':{
                            padding: '3px 10px'
                        }
                    }
                }} label={
                    <div className={styles.agree}>
                        I have read and agreed to the following Trip.com booking terms and conditions:
                        <Link href="#" >Flight Booking Policies</Link>
                        <Link href="#" >Privacy Statement</Link>
                        <Link href="#" >China Eastern Airlines Corporation Limited General Conditions for Transportation of Passenger and Baggage</Link>
                        <Link href="#" >Voluntary Changes and Refunds for China Eastern Domestic Flights Implementing Rules</Link>
                        <Link href="#" >China Eastern Overbooking Service Plan</Link>
                        <Link href="#" >Voluntary Changes and Refunds for China Eastern International Flights Implementing Rules</Link>
                    </div>
                } control={
                    <Checkbox checked={agree}  onChange={handleSetAgree} />
                } />
            </div>
            <div className={styles.payContainer}>
                <div className={styles.commonBox}>
                    <div className={`${styles.payPrice} s-flex jc-bt ai-ct`}>
                        <div className={styles.payPriceLabels}>Total</div>
                        <div className={styles.payPricevalue}>{resultAir?.currency}${totalPrice.totalPrice}</div>
                    </div>
                    <Button type="submit" sx={{
                        backgroundColor: 'var(--active-color)',
                        color:'var(--vt-c-white)',
                        fontWeight: 'bold',
                        fontSize: 18
                    }} fullWidth onClick={payTo}>Pay Now</Button>
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
    const navigate = useNavigate()

    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)



    const [open, setOpen] = useState(false)
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

    const passengerRef = useRef<{
        triggerSubmit:() => Promise<IPassenger>
    }>(null)
    const contactRef = useRef<{
        triggerSubmit:() => Promise<IContact>
    }>(null)

    const handlepaySubmit = async () => {
        const passengerForm = [] as IPassenger[]
        const contactForm = [] as IContact[]
        let passengerResult = {} as IPassenger|null
        let contactFormResult = {} as IContact|null
        if(passengerRef.current){
            passengerResult = await passengerRef.current.triggerSubmit()
        }
        if(contactRef.current){
            contactFormResult = await contactRef.current.triggerSubmit()
        }
        if(passengerResult && contactFormResult){
            passengerForm.push(passengerResult)
            contactForm.push(contactFormResult)
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
                passengers:passengerForm,
                contacts:contactForm
            } as OrderCreate
            orderCreateAgent(result).then(res => {
                if(res.succeed){
                    setDialogVisible(true)
                    setOrderNumber(res.response.orderNumber)
                }
            })
        }
    }

    const handleCloseVisible = () => {
        setDialogVisible(false)
    }
    const handlePayment = () => {
        paymentOrderAgent(orderNumber).then(res => {
            if(res.succeed){
                setOpen(true)
                setDialogVisible(false)
                setTimeout(() => {
                    navigate('/')
                },500)
            }
        })
    }

    const totalPrice = useMemo(() => {
        if(!airChoose.result) return 0
        return calculateTotalPriceSummary(airChoose.result.itineraries,query.travelers)
    },[airChoose,query.travelers])


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
                            <div className={`s-flex flex-dir`}>
                                {
                                    airChoose.result?.itineraries.map(itinerarie => {
                                        return itinerarie.segments.map(segment => (
                                            <div key={`${itinerarie.itineraryKey}-${segment.flightNumber}`}>
                                                <div className={`${styles.firportTitle} s-flex ai-fe`}>
                                                    <span>Trip to {segment.arrivalAirport}</span>
                                                    <div className={`${styles.firportSet} cursor-p s-flex ai-ct`}>
                                                        <span>Change Flight</span>
                                                        <DriveFileRenameOutlineIcon sx={{
                                                            color: 'var(--active-color)',
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            ml: 0.5,
                                                        }}/>
                                                    </div>
                                                </div>
                                                <div className={`${styles.firportInfomationBox} s-flex flex-dir`}>
                                                    <FirportInfomation key={segment.flightNumber} segment={segment} />
                                                </div>
                                            </div>
                                        ))
                                    })
                                }
                            </div>
                            {/*<Passenger />*/}
                        </div>
                        <div className={styles.cardCom}>
                            <CardCom totalPrice={totalPrice} />
                        </div>
                    </div>

                </div>
            </div>
            <div className={`${styles.leftDetail}`}>
                <div className={`${styles.wContainer} s-flex flex-dir`}>
                    <PassengerForm ref={passengerRef} />
                    <ContactForm ref={contactRef} />
                    <div className={styles.package}>
                        <div className={styles.packgaeTitle}>
                            Additional Baggage Allowanc
                        </div>
                        <div className={`${styles.packgaeTips} s-flex ai-ct`}>
                            <Typography fontSize={14} display={'flex'} alignItems={'center'} sx={{
                                color: 'var(--keynote-text)',
                            }}>
                                <CheckIcon sx={{
                                    fontSize: 14,
                                    color: 'var(--keynote-text)',
                                }}/>
                                Bring everything you need for your trip.</Typography>
                            <Link href="#" fontSize={14} underline="hover">
                                Baggage Allowance
                            </Link>
                        </div>
                        <div className={styles.commonBox}>
                            <div className={styles.packageContent}>
                                <Grid container spacing={2}>
                                    <Grid size={3}></Grid>
                                    <Grid size={3}>
                                        <div className={`${styles.packageli} s-flex ai-ct flex-dir`}>
                                            <div className={`${styles.packageliPicture} s-flex ai-ct jc-ct`}>
                                                <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.49/images/baggage/personal_no.png_.webp" alt=""/>
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
                                                <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.49/images/baggage/carryOn.png_.webp" alt=""/>
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
                                                <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.49/images/baggage/checkIn.png_.webp" alt=""/>
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
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <div className={styles.cityText}>Beijing - Shanghai</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetail}>Passenger 1</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>Included in carry-on allowance</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>1 piece, 8 kg total</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>20 kg</div>
                                    </Grid>

                                </Grid>
                                <Divider sx={{
                                    my:'20px'
                                }} />
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <div className={styles.cityText}>Shanghai - Beijing</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetail}>Passenger 1</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>Included in carry-on allowance</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>1 piece, 8 kg total</div>
                                    </Grid>
                                    <Grid size={3}>
                                        <div className={styles.cityDetailSp}>20 kg</div>
                                    </Grid>

                                </Grid>
                            </div>

                        </div>
                    </div>
                    <div className={styles.cancellation}>
                        <div className={styles.cancellationTitle}>Cancellation & Change Policies</div>
                        <div className={styles.commonBox}>
                            <div className={`${styles.cancellationli} s-flex ai-ct cursor-p`}>
                                <span>Cancellation fee</span>
                                <span>From US$14.00</span>
                                <ChevronRightIcon sx={{fontSize: 22}} />
                            </div>
                            <div className={`${styles.cancellationli} s-flex ai-ct cursor-p`}>
                                <span>Change fee</span>
                                <span>From US$14.00</span>
                                <ChevronRightIcon sx={{fontSize: 22}} />
                            </div>
                        </div>

                    </div>
                    <div className={styles.stayDiscounts}>
                        <div className={`${styles.stayDiscountsTitle} s-flex ai-ct`}>
                            Stay Discounts
                            <ErrorOutlineIcon sx={{
                                fontSize: 18,
                                ml: '10px'
                            }} />
                        </div>
                        <div className={styles.commonBox}>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <div className={`${styles.stayDiscountsli} s-flex flex-dir ai-ct`}>
                                        <div className={styles.stayDiscountsliPicture}>
                                            <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.30/images/complete/hotelCross/pic_coupon.png" alt=""/>
                                        </div>
                                        <div className={`${styles.stayDiscountsliTitle} ellipsis-1`}>
                                            New Guest  Offer
                                        </div>
                                        <div className={`${styles.stayDiscountsliPrice}`}>
                                            5% off (up to US$6.00)
                                        </div>
                                    </div>
                                </Grid>
                                <Grid size={4}>
                                    <div className={`${styles.stayDiscountsli} s-flex flex-dir ai-ct`}>
                                        <div className={styles.stayDiscountsliPicture}>
                                            <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.30/images/complete/hotelCross/pic_tripcoins.png" alt=""/>
                                        </div>
                                        <div className={`${styles.stayDiscountsliTitle} ellipsis-1`}>
                                            Trip Coins
                                        </div>
                                        <div className={`${styles.stayDiscountsliPrice}`}>
                                            Worth 5% of Your Booking
                                        </div>
                                    </div>
                                </Grid>
                                <Grid size={4}>
                                    <div className={`${styles.stayDiscountsli} s-flex flex-dir ai-ct`}>
                                        <div className={styles.stayDiscountsliPicture}>
                                            <img src="https://static.tripcdn.com/packages/flight/flight-x-product/1.0.30/images/complete/hotelCross/pic_exclsive.png" alt=""/>
                                        </div>
                                        <div className={`${styles.stayDiscountsliTitle} ellipsis-1`}>
                                            Flyer Exclusive Offer
                                        </div>
                                        <div className={`${styles.stayDiscountsliPrice}`}>
                                            Up to 25% Off
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <NextStep totalPrice={totalPrice} paySubmit={handlepaySubmit} />
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical:'top', horizontal:'right' }}
                      onClose={handleClose}>
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' , fontSize: 18 }}
                >
                    Payment successful! Redirecting soon~
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogVisible}
                onClose={handleCloseVisible}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"The order is successfully placed, please pay in time"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please click Pay to complete this order
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handlePayment} autoFocus>
                        Payment
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})

export default Detail;
