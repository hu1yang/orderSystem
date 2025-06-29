import {memo, useRef, useState} from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import styles from './styles.module.less'
import {
    Alert,
    Avatar, Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    Divider, FormControlLabel,
    Grid,
    Link, Snackbar, type SnackbarCloseReason,
    Typography
} from "@mui/material";
import type {IContact, OrderCreate, Passenger as IPassenger} from '@/types/order.ts'


import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import T from '@/assets/t.png'
import C from '@/assets/c.png'
import Passenger from "@/component/passenger/passenger.tsx";

import PassengerForm from "./PassengerForm.tsx";
import ContactForm from './ContactForm.tsx'
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import {orderCreateAgent} from "@/utils/request/agetn.ts";

const CardCom = memo(() => {

    const resultAir = useSelector((state: RootState) => state.ordersInfo.airChoose.result)


    const [chipHide, setChipHide] = useState(false)
    const [priceHide, setPriceHide] = useState(false)

    const setChip = () => {
        setChipHide(!chipHide)
    }
    const setPirce = () => {
        setPriceHide(!priceHide)
    }

    return (
        <Card sx={{minWidth: 376, boxShadow: '0 4px 16px 0 rgba(69,88,115,.2)'}}>
            <CardHeader title="Price Details" sx={{
                px: 2,
                '.MuiTypography-root': {
                    color: 'var(--text-color)',
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            }}/>
            <CardContent sx={{
                pt: 0,
                px: 2
            }}>
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                        <div className={`${styles.labels} s-flex ai-ct cursor-p`} onClick={setPirce}>
                            <span>Tickets(1 Adult)</span>
                            <ExpandMoreIcon sx={{
                                transition: 'transform .2s ease-in-out',
                                transform: !priceHide ? 'rotate(0deg)' : 'rotate(180deg)',
                            }}/>
                        </div>
                        <div className={styles.values}>
                            <span>US$349.30</span>
                        </div>
                    </div>
                    <div className={`${styles.priceHeight} full-width`}
                         style={{maxHeight: !priceHide ? '0px' : '1000px'}}>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span>Adults (Passenger 1)</span>
                            </div>
                            <div className={styles.values}>
                                <span>US$349.30 × 1</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span style={{fontSize: 12}}>Fare</span>
                            </div>
                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>US$329.70 × 1</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span style={{fontSize: 12}}>Taxes & fees</span>
                            </div>
                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>US$19.60 × 1</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                        <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                            <span>Baggage</span>
                        </div>

                    </div>
                    <div className={`${styles.priceHeight} ${styles.baggage} full-width`}>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0
                            }} title={
                                <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                    Click to view baggage allowance details
                                </Typography>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Personal item</span>
                                </div>
                            </HtmlTooltip>

                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>Check with airline</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '& .MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage
                                        allowance: <strong
                                            style={{color: 'var(--text-color)', fontSize: 14, fontWeight: 'bold'}}>20
                                            kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>

                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Carry-on baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12, color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '& .MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage
                                        allowance: <strong
                                            style={{color: 'var(--text-color)', fontSize: 14, fontWeight: 'bold'}}>20
                                            kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'var(--tips-gary-color)'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Checked baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12, color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider
                    sx={{
                        borderTopStyle: 'dashed',
                        borderTopWidth: '1px',
                        borderColor: 'var(--put-border-color)',
                        borderBottomStyle: 'inherit',
                        mt: 2
                    }}
                />
            </CardContent>
            <CardActions sx={{
                px: 2,
                pb: 3
            }}>
                <div className={`s-flex flex-dir jc-fe ai-fe full-width`}>
                    <div className={`${styles.priceLine} s-flex jc-bt ai-ct full-width`}>
                        <div className={styles.labels}>Total</div>
                        <div className={styles.prices}>US$440.60</div>
                    </div>
                    <HtmlTooltip sx={{
                        '.MuiTooltip-tooltip': {
                            maxWidth: 400
                        }
                    }} title={
                        <div className={styles.tripBox}>
                            <div className={styles.tripTitle}>Start Earning Trip Coins</div>
                            <Chip label="100 Trip Coins = US$1" size="medium" avatar={<Avatar src={T} sx={{
                                width: '18px !important',
                                height: '18px !important',
                            }}/>} sx={{
                                height: '25px',
                                borderRadius: '2px',
                                borderColor: 'rgba(255,111,0,.32)',
                                background: '#f5f7fa',
                                mt: '8px',
                                '.MuiChip-label': {
                                    color: 'var(--text-color)'
                                }
                            }}/>
                            <div className={`${styles.tripBoxFor} s-flex flex-dir ai-fs`}>
                                <div className={styles.tripBoxTitles}>
                                    For this trip
                                </div>
                                <div className={`${styles.tripBoxContent} s-flex`}>
                                    <CheckIcon sx={{
                                        fontSize: 14,
                                        color: 'var(--keynote-text)',
                                        mt: '5px'
                                    }}/>
                                    <div className={`s-flex flex-dir`} style={{textAlign: 'left'}}>
                                        <div className={styles.tripBoxContentText}>You'll earn Trip Coins
                                            worth <strong> 0.25%</strong> of the booking total after your trip!
                                        </div>
                                        <div className={`${styles.tripBoxMore} s-flex ai-ct cursor-p`}
                                             onClick={setChip}>
                                            <div className={styles.tripBoxMoreText}>
                                                Details
                                            </div>
                                            <ExpandMoreIcon sx={{
                                                fontSize: 20,
                                                color: 'var(--active-color)',
                                                transition: 'transform .2s ease-in-out',
                                                transform: chipHide ? 'rotate(0deg)' : 'rotate(180deg)',
                                            }}/>
                                        </div>
                                        {
                                            chipHide && <Chip avatar={<Avatar src={C} sx={{
                                                width: '18px !important',
                                                height: '18px !important',
                                            }}/>} variant="outlined" sx={{
                                                borderRadius: '2px',
                                                background: 'var(--vt-c-white)'
                                            }} label={
                                                <div className={`${styles.tripBoxMoreBox} s-flex ai-ct`}>
                                                    <div className={styles.ratio}>+10%</div>
                                                    <span>Become a gold member and earn 10% more</span>
                                                </div>
                                            }/>
                                        }

                                    </div>

                                </div>

                            </div>
                            <div className={styles.tripBoxEarn}>
                                <div className={styles.tripBoxTitles}>
                                    How to Earn Trip Coins
                                </div>
                                <div className={`${styles.tripBoxContent} s-flex`}>

                                    <div className={styles.tripBoxContentText}>
                                        You'll earn Trip Coins each time you book with us. Trip Coins can be used to
                                        save on future bookings.
                                    </div>
                                </div>
                            </div>
                        </div>
                    }>
                        <Chip label="Trip Coins + 111" size="medium" avatar={<Avatar src={T} sx={{
                            width: '18px !important',
                            height: '18px !important',
                        }}/>} variant="outlined" sx={{
                            height: '25px',
                            borderRadius: '2px',
                            borderColor: 'rgba(255,111,0,.32)',
                            background: 'rgba(255,111,0,.08)',
                            mt: 1,
                            '.MuiChip-label': {
                                color: '#eb5600'
                            }
                        }}/>
                    </HtmlTooltip>

                </div>

            </CardActions>
        </Card>
    )
})

const NextStep = memo(({paySubmit}:{
    paySubmit:() => void
}) => {
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
                        <div className={styles.payPricevalue}>US$384.80</div>
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
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)


    const [open, setOpen] = useState(false)

    const handleClose = (_event?: React.SyntheticEvent | Event,
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
    }>()

    const handlepaySubmit = async () => {
        const passengerForm = [] as IPassenger[]
        const contactForm = [] as IContact[]
        let passengerResult = {} as IPassenger|null
        let contactFormResult = {} as IContact|null
        if(passengerRef.current){
            passengerResult = await passengerRef.current.triggerSubmit()
        }
        if(passengerRef.current){
            contactFormResult = await contactRef.current.triggerSubmit()
        }
        if(passengerResult && contactFormResult){
            passengerForm.push(passengerResult)
            contactForm.push(contactFormResult)
            const result = {
                ...airChoose,
                request:{
                    ...query
                },
                shuttleNumber:'',
                tLimit:'',
                remarks:'',
                passengers:passengerForm,
                contacts:contactForm
            } as OrderCreate
            orderCreateAgent(result).then(res => {
                if(res.succeed){
                    setOpen(true)

                }
            })


        }
    }

    return (
        <div className={`${styles.detailContainer} s-flex jc-bt ai-fs`}>
            <div className={`${styles.leftDetail} `}>
                <div className={`${styles.gap} s-flex flex-dir`}>
                    <div className={`${styles.firportTitle} s-flex ai-fe`}>
                        <span>Trip to Shanghai</span>
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
                        {
                            airChoose.result?.itineraries.map(itinerarie => {
                                return itinerarie.segments.map(segment => (
                                    <FirportInfomation key={segment.flightNumber} segment={segment} />
                                ))
                            })
                        }
                    </div>
                    <Passenger />
                </div>
                <div className={`s-flex flex-dir`}>
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
                    <NextStep paySubmit={handlepaySubmit} />
                </div>
            </div>
            <div className={styles.cardCom}>
                <CardCom />
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
        </div>
    )
})

export default Detail;
