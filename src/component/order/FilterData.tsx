import {memo, useCallback, useState} from "react";
import HelpIcon from '@mui/icons-material/Help';
import styles from './styles.module.less'
import {
    Box, Button,
    Card,
    CardContent,
    Divider,
    Link,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import LuggageIcon from "@mui/icons-material/Luggage";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BoltIcon from '@mui/icons-material/Bolt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FareCardsSlider from "@/component/order/Detail.tsx";
import HtmlTooltip from "../defult/Tooltip";
import AirTooltip from "@/component/defult/AirTooltip.tsx";



const FlightTimeline = memo(() => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" flex={1} paddingLeft={'8px'} maxWidth={400}>
                {/* 左侧时间与机场 */}
            <HtmlTooltip placement="bottom" title={
                <div style={{fontSize: '1.4em',}}>Shanghai Pudong International Airport T2</div>
            }>
                <Box textAlign="center">
                    <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>06:55</Typography>
                    <Box
                        lineHeight={1}
                        className={'cursor-h'}
                        sx={{
                            display: 'inline-block',
                            mt: 0.5,
                            px: 1,
                            py: 0.2,
                            backgroundColor: '#fff2ec',
                            color: '#f56c00',
                            fontSize: '1.1em',
                            borderRadius: '3px',
                            fontWeight: 500,
                        }}
                    >
                        PVG T2
                    </Box>
                </Box>
            </HtmlTooltip>
            {/* 中间线段与飞行信息 */}
            <HtmlTooltip placement="bottom" componentsProps={{
                tooltip: {
                    sx: {
                        width: 1200, // ✅ 直接控制
                    },
                },
            }} title={
                <Box className={styles.airportLine}>
                    <Box className={styles.airportNode}>
                        <span className={styles.code}>PVG</span>
                        Shanghai Pudong International Airport T2
                    </Box>
                    <Box className={styles.airportNode}>
                        <span className={styles.code}>PKX</span>
                        Beijing Daxing International Airport
                    </Box>
                </Box>
            }>
                <Box flex="1" mx={2} position="relative">
                    {/* 线条 */}
                    <Box
                        sx={{
                            height: '2px',
                            backgroundColor: '#d8dce5',
                            position: 'relative',
                            top: '50%',
                            '&.MuiBox-root': {
                                background: '#d8dce5',
                                position: 'relative',
                                '&::before': {
                                    content: '""', // ✅ 必须用字符串
                                    position: 'absolute',
                                    width: '6px',
                                    height: '6px',
                                    top: '50%',
                                    left: '0',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#d8dce5',
                                },
                                '&::after': {
                                    content: '""', // ✅ 必须用字符串
                                    position: 'absolute',
                                    width: '6px',
                                    height: '6px',
                                    top: '50%',
                                    right: '0',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#d8dce5',
                                },
                            }
                        }}
                    />
                    {/* 飞行时长 */}
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '-18px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '1em',
                            color: '#a0a4af',
                        }}
                    >
                        2h 35m
                    </Typography>
                    {/* Nonstop 标签 */}
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '1em',
                            color: '#a0a4af',
                        }}
                    >
                        Nonstop
                    </Typography>
                </Box>
            </HtmlTooltip>
            <HtmlTooltip placement="bottom" title={
                <div style={{fontSize: '1.4em',}}>Beijing Daxing International Airport</div>
            }>
                {/* 右侧时间与机场 */}
                <Box textAlign="center">
                    <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>09:30</Typography>
                    <Typography
                        className={'cursor-h'}
                        sx={{ color: '#a0a4af', fontSize: '1.1em', mt: 0.5 }}
                        lineHeight={1}
                    >
                        PKX
                    </Typography>
                </Box>
            </HtmlTooltip>

        </Box>
    );
})

const filterTabArr = [
    {
        title: 'Nonstop First',
        price: 'US$146',
        value: 'nonstop_first',
    },
    {
        title: 'Recommended',
        price: 'US$146',
        tips: 'Our sorting method considers factors such as price, duration, and number of stops to provide you with a variety of options',
        value: 'recommended',
    },
    {
        title: 'Cheapest',
        price: 'US$152',
        value: 'cheapest',
    },
    {
        title: 'Sort By',
        price: 'US$152',
        value: 'sort_by',
        children: [
            {
                title: 'Fastest',
                price: 'US$298',
                value: 'fastest',
            },
            {
                title: 'Departure (Earliest)',
                price: 'US$211',
                value: 'departure_earliest',
            },
            {
                title: 'Departure (Latest)',
                price: 'US$173',
                value: 'departure_latest',
            },
            {
                title: 'Arrival (Earliest)',
                price: 'US$211',
                value: 'arrival_earliest',
            },
            {
                title: 'Arrival (Latest)',
                price: 'US$173',
                value: 'arrival_latest',
            },
        ],
    },
];

const FilterTab = memo(() => {
    const [tabValue, setTabValue] = useState('cheapest')

    const handleChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    },[])

    return (
        <div className={styles.filterTab}>
            <Tabs value={tabValue} onChange={handleChange} variant="fullWidth" indicatorColor='primary' aria-label='filter tab' sx={{
                '& .MuiTabs-indicator': {
                    display: 'none', // ❌ 隐藏底部长条
                },
            }}>
                {
                    filterTabArr.map((item, index) => (
                        <Tab key={item.value} id={`tab-${item.value}`} value={item.value} sx={{
                            '&.Mui-selected span':{
                                color: 'var(--put-border-hover-color) !important', // ✅ 选中颜色
                            },
                            borderRight: index < filterTabArr.length - 1 ? '1px solid #ddd' : 'none',
                        }} label={
                            <Box className={`${styles.tabItem} s-flex flex-dir`}>
                                <span>{item.title}</span>
                                <span>{item.price}</span>
                            </Box>
                        } />
                    ))
                }
            </Tabs>
        </div>
    )
})

const FilterItem = memo(() => {
    const [open, setOpen] = useState(false)

    const openMore = () => {
        setOpen(!open)
    }

    return (
        <div className={styles.filterItem}>
            <div className={styles.filterItemBox}>
                <div className={`${styles.filterTips} s-flex ai-ct`}>
                    <div className={`${styles.tipsIcon} s-flex ai-ct`}>
                        <LuggageIcon sx={{fontSize:14, color: '#05939f' }} />
                        <BusinessCenterIcon sx={{fontSize:14, color: '#05939f' }} />
                        <span>Included</span>
                    </div>
                    <HtmlTooltip title={
                        <div className={styles.tooltipContent}>
                            <div className={styles.tooltipTitle}>
                                <span>CO2e Emissions</span>
                            </div>
                            <Card sx={{
                                boxShadow: 'none !important',
                                border: '1px solid #ddd',
                            }}>
                                <CardContent sx={{
                                    '&.MuiCardContent-root':{
                                        padding: '10px',
                                    }
                                }}>
                                    <div className={styles.cardBox}>
                                        <div className={`${styles.cardLi} s-flex ai-ct jc-bt`}>
                                            <div>This flight</div>
                                            <div>102.75 kg CO2e</div>
                                        </div>
                                        <div className={`${styles.cardLi} s-flex ai-ct jc-bt`}>
                                            <div>Typical for this route</div>
                                            <div>134.29 kg CO2e</div>
                                        </div>
                                        <Divider />
                                        <div className={`${styles.cardLi} s-flex ai-ct jc-bt`}>
                                            <div>23% lower</div>
                                            <div>- 31.54 kg CO2e</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Link href="#">How are CO2e emissions calculated?</Link>
                        </div>
                    }>
                        <div className={`${styles.tipsIcon} s-flex ai-ct`}>
                            <span>- 12% CO2e</span>
                        </div>
                    </HtmlTooltip>
                </div>
                <div className={`${styles.airInfomation} s-flex ai-ct`}>
                    <div className={`${styles.leftInfo} s-flex flex-1`}>
                        <div className={`${styles.leftInfoDetail} s-flex flex-1`}>
                            <div className={styles.picture}>
                                <img src="https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/ca.webp" alt=""/>
                            </div>
                            <div className={`${styles.leftInfoDetailTitle}`}>
                                <div className={styles.airTitle}>
                                    <span>Air China</span>
                                </div>
                                <HtmlTooltip title={
                                    <AirTooltip />
                                }>
                                    <div className={styles.airIcon}>
                                        <BoltIcon />
                                        <RestaurantIcon />
                                        <WifiIcon />
                                        <PlayCircleIcon />
                                    </div>
                                </HtmlTooltip>

                            </div>
                        </div>
                        <FlightTimeline />
                    </div>
                    <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                        <div className={`${styles.priceBox} s-flex flex-dir ai-fe`}>
                            <div className={`s-flex ai-fe ${styles.price}`}>
                                <span>from</span>
                                <div>US$235</div>
                            </div>
                            <div>
                                <span>Round-trip</span>
                            </div>
                        </div>
                        <Button variant='contained' endIcon={!open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />} onClick={openMore} sx={{
                            backgroundColor: !open ? 'var(--put-border-hover-color)' : 'transparent',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                            color: !open ? '#fff' : '#3264ff',
                            width: '110px'

                        }}>
                            {!open?'Select':'Hide'}
                        </Button>
                    </div>
                </div>
            </div>
            <div style={{maxHeight: open ? 600: 0}} className={styles.filterItemMore}>
                <FareCardsSlider />
            </div>
        </div>
    )
})

const FilterData = memo(() => {
    return (
        <div className={`${styles.filterData} flex-1`}>
            <div className={styles.filterBox}>
                <div className={styles.filterHeader}>
                    <div className={styles.stackedColor}></div>
                    <div className={`s-flex jc-bt ai-ct ${styles.filterHeaderTitle}`}>
                        <h2>1. Departing to Shanghai</h2>
                        <div className={`s-flex ai-fs cursor-p`}>
                            <span>*Last updated: 17:42:44</span>
                            <HtmlTooltip title={
                                <ul>
                                    <li>Ticket prices are determined by various factors, including seasonal demand, route popularity, booking time, and seat availability. Airlines adjust ticket prices in real-time, which can cause fluctuations.</li>
                                    <li>We recommend booking soon to secure the current offer. We will do our best to continuously monitor the latest prices for you. For accurate information, please refer to the price on the payment page.</li>
                                </ul>
                            }>
                                <HelpIcon sx={{fontSize: 12,margin: '5px 0 0 5px'}} />
                            </HtmlTooltip>
                        </div>
                    </div>
                </div>
                <FilterTab />
                <div className={styles.filterContent}>
                    {
                        Array.from({length: 30}).map((_, index) => (
                            <FilterItem key={index} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
})

export default FilterData;
