import {memo} from "react";
import {Tabs, Tab, Card, CardHeader, Divider, CardContent, Grid, CardActions, Button} from "@mui/material";
import FlightIcon from '@mui/icons-material/Flight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import styles from './styles.module.less'
import {useNavigate} from "react-router";

interface IOrderProps {
    departure:string;
    arrival:string;
    price:string;
}


const OrderLi = memo(({
                          departure,
                          arrival,
                          price
                      }:IOrderProps) => {
    return (
        <div className={styles.orderli}>
            <div className={`${styles.orderTitle} s-flex ai-ct jc-bt`}>
                <div className={`${styles.orderTitleLeft} s-flex ai-ct`}>
                    <p>{departure}</p>
                    <TrendingFlatIcon sx={{
                        fontSize: 30,
                        mx:'10px'
                    }} />
                    <p>{arrival}</p>
                </div>
                <div className={styles.orderPrice}>
                    {price}
                </div>
            </div>
            <div className={styles.orderDetail}>
                <Grid container spacing={2}>
                    <Grid size={4} sx={{
                        display:'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 'var(--pm-16)'
                    }}>
                        <div className={styles.timer}>
                            <span>20:45</span>
                            <p>May 31</p>
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles.timer}>
                            <span>23:10</span>
                            <p>May 31</p>
                        </div>
                    </Grid>
                    <Grid size={4} sx={{
                        p: 'var(--pm-16)'

                    }}>
                        <div className={styles.airlinesname}>
                            <img src="https://pic.tripcdn.com/airline_logo/1.5x/mu.webp" alt=""/>
                            <span>MU9192</span>
                        </div>
                        <div className={styles.tips}>China Eastern Airlines</div>
                    </Grid>
                    <Grid size={4} sx={{
                        py: 'var(--pm-16)'
                    }}>
                        <div className={styles.airlinesname}>
                            <span>pettes</span>
                        </div>
                        <div className={styles.tips}>1 passenger</div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
})

const Mine = () => {
    const navigate = useNavigate()
    const toPay = () => {
        navigate('/mine/orderDetail')
    }

    return (
        <div className={styles.mineContainer}>
            <div className={`${styles.mineMain} s-flex ai-fs jc-bt`}>
                <div style={{width: '280px',height: '200px' , background: 'var(--vt-c-white)' , borderRadius: 'var(--border-radius)' }}>

                </div>
                <div className={styles.mineContent}>
                    <div className={styles.header}>
                        <div className={styles.mineTitle}>
                            My Bookings
                        </div>
                        <Tabs value={'all'} variant="fullWidth" sx={{
                            borderRadius: 'var(--border-radius)',
                            maxHeight:'38px',
                            '.MuiTabs-indicator': {
                                backgroundColor: 'transparent',
                            },
                            '.MuiButtonBase-root': {
                                backgroundColor: 'var(--vt-c-white)',
                                color: 'var(--text-color)',
                                fontWeight: 'bold',
                                fontSize: 14,
                                '&.Mui-selected':{
                                    backgroundColor: 'var(--text-color)',
                                    color: 'var(--vt-c-white)',
                                }
                            }
                        }}>
                            <Tab value={'all'} label={'All'} sx={{
                                '&.MuiButtonBase-root':{
                                    minHeight: '38px'

                                }
                            }} />
                            <Tab value={'awaitingPayment'} label={'Awaiting Payment'} />
                            <Tab value={'upcoming'} label={'Upcoming'} />
                            <Tab value={'awaitingReview'} label={'Awaiting Review'} />
                        </Tabs>
                    </div>
                    <div className={styles.mineBox}>
                        <Card sx={{
                            mb:'var(--pm-16)',
                            cursor: 'pointer',
                        }}>
                            <CardHeader title={
                                <div className={`${styles.cardHeader} s-flex ai-ct jc-bt`}>
                                    <div className={`${styles.cardHeaderLeft} s-flex ai-fs`}>
                                        <FlightIcon sx={{
                                            fontSize: 18,
                                            mr:'10px',
                                            color: 'var(--tips-color)'
                                        }} />
                                        <p>Booking No. </p>
                                        <i>1688890541505267</i>
                                        <ContentCopyIcon sx={{
                                            cursor:'pointer',
                                            ml:'6px',
                                            fontSize: 14,
                                            color: 'var(--tips-color)'
                                        }} />
                                        <Divider orientation="vertical" variant="middle" flexItem sx={{
                                            mx: 1,
                                            my: 0,

                                        }} />
                                        <p>Booking Date : May 26, 2025</p>
                                    </div>
                                    <div className={styles.cardHeaderRight}>
                                        <div className={styles.tips}>
                                            <span>Awaiting Payment</span>
                                        </div>

                                    </div>
                                </div>
                            }  />
                            <CardContent sx={{
                                pt:0
                            }}>
                                <Divider variant="middle" flexItem sx={{
                                    m:0,
                                    p:0
                                }} />
                                <div className={styles.orderBox}>
                                   <OrderLi departure={'Beijing (PKX) '} arrival={' Shanghai (SHA)'} price={'US$146.10'} />
                                   <OrderLi departure={'Beijing (PKX) '} arrival={' Shanghai (SHA)'} price={'US$146.10'} />
                                </div>
                            </CardContent>
                            <CardActions disableSpacing>
                                <Button variant="contained" size={'large'} sx={{
                                    ml: 'auto',
                                    backgroundColor: '#f66f03',
                                    fontSize: 14
                                }} onClick={toPay}>Pay Now</Button>
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Mine;
