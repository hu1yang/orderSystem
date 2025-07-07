import {memo, useCallback, useEffect, useMemo, useState} from "react";
import HelpIcon from '@mui/icons-material/Help';
import styles from './styles.module.less'
import {
    Box, Button,
    Card,
    CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, Grid,
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
import FareCardsSlider from "@/component/order/Detail.tsx";
import HtmlTooltip from "../defult/Tooltip";
import AirTooltip from "@/component/defult/AirTooltip.tsx";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import type { ResponseItinerary, Result, ResultType, Segment} from "@/types/order.ts";
import FirportInfomation from "@/component/passenger/firportInfomation.tsx";
import {extractTimeWithTimezone, formatFlyingTime} from "@/utils/public.ts";
import {setChannelCode, setResult, setResultItineraries , prevAirChoose} from "@/store/orderInfo.ts";
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import PriceDetail from "@/component/order/priceDetail.tsx";
import {getTotalPriceByFamilyCode, groupAmountByFamilyCodeFnc} from "@/utils/price.ts";
import {format} from "date-fns";



const FlightTimeline = memo(({segment}:{
    segment:Segment
}) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" flex={1} paddingLeft={'8px'} maxWidth={400}>
                {/* 左侧时间与机场 */}
            <HtmlTooltip placement="bottom" title={
                <div style={{fontSize: '1.4em',}}>{segment.departureAirport} - {segment.flightNumber}</div>
            }>
                <Box textAlign="center">
                    <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>{extractTimeWithTimezone(segment.departureTime)}</Typography>
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
                        {segment.departureAirport} {segment.departureTerminal}
                    </Box>
                </Box>
            </HtmlTooltip>
            {/* 中间线段与飞行信息 */}

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
                    <HtmlTooltip placement="bottom"  title={
                        <Box className={styles.airportLine}>
                            <Box className={styles.airportNode}>
                                <span className={styles.code}>{segment.departureAirport}</span>
                                {segment.departureAirport} International Airport {segment.departureTerminal}
                            </Box>
                            <Box className={styles.airportNode}>
                                <span className={styles.code}>{segment.arrivalAirport}</span>
                                {segment.arrivalAirport} International Airport {segment.arrivalTerminal}
                            </Box>
                        </Box>
                    }>
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
                            {formatFlyingTime(segment.totalFlyingTime!)}
                        </Typography>
                </HtmlTooltip>
                {/* Nonstop 标签 */}
                <HtmlTooltip placement="bottom"  title={
                    <Box className={styles.airportLine}>
                        <Box className={styles.airportNode}>
                            <span className={styles.code}>{segment.departureAirport}</span>
                            {segment.departureAirport} International Airport {segment.departureTerminal}
                        </Box>
                        <Box className={styles.airportNode}>
                            <span className={styles.code}>{segment.arrivalAirport}</span>
                            {segment.arrivalAirport} International Airport {segment.arrivalTerminal}
                        </Box>
                    </Box>
                }>
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: '6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '1rem',
                            color: '#a0a4af',
                        }}
                    >
                        {
                            segment.stops.length?
                                'Stop'
                                :
                                'Nonstop'
                        }
                    </Typography>
                </HtmlTooltip>
            </Box>
            <HtmlTooltip placement="bottom" title={
                <div style={{fontSize: '1.4em',}}>{segment.arrivalAirport} International Airport{segment.arrivalTerminal}</div>
            }>
                {/* 右侧时间与机场 */}
                <Box textAlign="center">
                    <Typography fontWeight="bold" fontSize="1.7rem" lineHeight={1}>{extractTimeWithTimezone(segment.arrivalTime)}</Typography>
                    <Typography
                        className={'cursor-h'}
                        sx={{ color: '#a0a4af', fontSize: '1.1em', mt: 0.5 }}
                        lineHeight={1}
                    >
                        {segment.arrivalAirport}
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
                                <span className={`s-flex ai-ct`}>{item.title}
                                    {item.tips && <HtmlTooltip placement={'top'} title={
                                       <p style={{fontSize: 12 , color: 'var(--text-color)'}}>Our sorting method considers factors such as price, duration, and number of stops to provide you with a variety of options</p>
                                    }>
                                        <ErrorOutlineIcon sx={{
                                            fontSize: 18,
                                            ml: '10px'
                                        }} />
                                    </HtmlTooltip> }
                                </span>
                                <span>{item.price}</span>
                            </Box>
                        } />
                    ))
                }
            </Tabs>
        </div>
    )
})

const itineraryTypeMap = {
    multi: 'Multi-city',
    oneWay: 'One-way',
    round: 'Round-trip',
} as const
const FilterItem = memo(({itinerarie,channelCode,resultKey,currency,policies,contextId,resultType}:{
    itinerarie:ResponseItinerary
    channelCode:string
    resultKey:string
    policies: string[]
    contextId: string
    resultType: ResultType
    currency:string
}) => {
    const airportList = useSelector((state: RootState) => state.ordersInfo.airportList)
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const itinerarieQuery = useSelector((state: RootState) => state.ordersInfo.query.itineraries[airportActived])
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const travelers = useSelector((state: RootState) => state.ordersInfo.query.travelers)
    const dispatch = useDispatch()


    const navigate = useNavigate()

    const [disabledChoose, setDisabledChoose] = useState(false)

    const [open, setOpen] = useState(false)


    const openMore = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setChooseAmountCode('')
    }

    const beforePrice = useMemo(() => {
        if (airChoose.result) {
            const prices = airChoose.result.itineraries?.flatMap(itinerarie =>
                groupAmountByFamilyCodeFnc(itinerarie.amounts,query.travelers)
            ) || [];

            return prices.reduce((sum, price) => sum + price, 0);
        }
        return 0;
    },[airChoose])

    const totalPrice = useMemo(() => {
        // 当前行程价格
        const groupedCurrentPrices = groupAmountByFamilyCodeFnc(itinerarie.amounts, query.travelers);
        const priceCurrent = groupedCurrentPrices.length > 0
            ? Math.min(...groupedCurrentPrices)
            : Infinity;

        // 获取当前 airport 和结果
        const airport = airportList.find(a => a.channelCode === channelCode);
        if (!airport) return 0;

        const result = airport.results.find(a => a.contextId === contextId);
        if (!result) return 0;

        // 当前行程对象
        const currentItinerary = result.itineraries.find(i => Number(i.itineraryNo) === airportActived);
        if (!currentItinerary) return 0;

        const allNextCodes = currentItinerary.amounts
        .map(a => a.nextCodes)
        .filter(arr => Array.isArray(arr) && arr.length > 0)
        .flat();

        // 是否存在 nextCodes
        const hasNextCodes = allNextCodes.length > 0;

        // 下一乘行程
        const nextItinerary = result.itineraries.find(i => Number(i.itineraryNo) === airportActived + 1);

        let morePrices: number[] = [];

        if (nextItinerary) {
            const amountsToUse = hasNextCodes
                ? nextItinerary.amounts.filter(a => allNextCodes.includes(a.familyCode))
                : nextItinerary.amounts;

            morePrices = groupAmountByFamilyCodeFnc(amountsToUse, query.travelers);
        }

        const minPrice = morePrices.length > 0
            ? Math.min(...morePrices)
            : Infinity;

        const total = (isFinite(priceCurrent) ? priceCurrent : 0) +
            (isFinite(minPrice) ? minPrice : 0) +
            (isFinite(beforePrice) ? beforePrice : 0);

        return Math.ceil(total * 100) / 100;
    }, [channelCode, contextId, itinerarie, airportList, airportActived, airChoose, beforePrice, query.travelers]);



    const [chooseAmountCode, setChooseAmountCode] = useState<string>('')
    const handleChooseFnc = useCallback((code: string) => {
        setChooseAmountCode(code)
    }, [itinerarie.amounts]);

    const submitResult = () => {
        setDisabledChoose(true)
        if(!chooseAmountCode) return
        const chooseAmount = itinerarie.amounts.filter(amount => amount.familyCode === chooseAmountCode)

        const newItinerarie = {
            amounts:chooseAmount,
            itineraryNo:itinerarie.itineraryNo!,
            itineraryKey: itinerarie.itineraryKey,
            subItineraryId: itinerarie.subItineraryId!,
            segments: itinerarie.segments
        }

        if(airportActived === 0){
            const result = {
                contextId,
                policies,
                resultType,
                currency,
                resultKey,
                itineraries:[{...newItinerarie}]
            } as Result
            dispatch(setChannelCode(channelCode))
            dispatch(setResult(result))
        }else{
            dispatch(setResultItineraries(newItinerarie))
        }
        if(query.itineraries.length  === airportActived+1){
            navigate('/passenger')
        }
        setDisabledChoose(false)
        setOpen(false)
    }

    const totalPriceChoose = useMemo(() => {
        if (chooseAmountCode) {
            const rawTotal = getTotalPriceByFamilyCode(chooseAmountCode, itinerarie.amounts, travelers) + beforePrice;

            // 向上取整保留两位小数
            return Math.ceil(rawTotal * 100) / 100;
        }
        return 0;
    }, [chooseAmountCode]);


    return  (
        <div className={styles.filterItem}>
            <div className={styles.filterItemBox}>
                <div className={`${styles.filterTips} s-flex ai-ct`}>
                    <div className={`${styles.tipsIcon} s-flex ai-ct`}>
                        <LuggageIcon sx={{fontSize:14, color: 'var(--keynote-text)' }} />
                        <BusinessCenterIcon sx={{fontSize:14, color: 'var(--keynote-text)' }} />
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
                    <div className={`${styles.leftInfo} s-flex flex-1 ai-ct`}>
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
                        <Grid container className={'flex-1'} spacing={2}>
                            {
                                itinerarie.segments.map(segment => (
                                    <Grid size={12} key={segment.flightNumber}>
                                        <FlightTimeline segment={segment} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>
                    <div className={`${styles.rightInfo} s-flex jc-fe ai-ct`}>
                        <div className={`${styles.priceBox} s-flex flex-dir ai-fe`}>
                            <div className={`s-flex ai-fe ${styles.price}`}>
                                <span>from</span>
                                <div>{currency}${totalPrice}</div>
                            </div>
                            <div>
                                <span>{itineraryTypeMap[itineraryType]}</span>
                            </div>
                        </div>
                        <Button variant='contained' onClick={openMore} sx={{
                            backgroundColor: 'var(--put-border-hover-color)',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                            color: 'var(--vt-c-white)',
                            width: '110px'

                        }}>
                            Select
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" className={styles.dialogFirport} sx={{
                '.MuiDialog-paperWidthLg': {
                    width:'1024px'
                }
            }}>
                <DialogTitle sx={{
                    '&.MuiDialogTitle-root': {
                        padding: '32px 32px 16px'
                    }
                }}>
                    <div className={styles.firportTitle}>
                        <span>Trip to {itinerarieQuery.departure}</span>
                    </div>
                </DialogTitle>
                <DialogContent sx={{
                    '&.MuiDialogContent-root':{
                        backgroundColor:'#f6f7fa',
                        p:0
                    }
                }}>
                    <div className={`${styles.firportInfo}`}>
                        <Grid container spacing={2}>
                            {
                                itinerarie.segments.map(segment => (
                                    <Grid size={4} key={segment.flightNumber}>
                                        <FirportInfomation segment={segment} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>
                    <div style={{
                        backgroundColor:'#f6f7fa',
                        padding:'8px 32px 0'
                    }}>
                        <FareCardsSlider amounts={itinerarie.amounts} disabledChoose={disabledChoose} currency={currency} chooseFnc={handleChooseFnc} />
                    </div>
                </DialogContent>
                <DialogActions sx={{
                    '&.MuiDialogActions-root':{
                        backgroundColor:'#f6f7fa',
                        p: '16px 32px'
                    }
                }}>
                    <div className={`s-flex jc-fe ai-ct`}>
                        {
                            chooseAmountCode?
                                <Box className={'s-flex flex-dir'}>
                                    <div className={`s-flex ai-ct`}>
                                        <HtmlTooltip placement="top" sx={{
                                            width: 300,
                                            'MuiTooltip-tooltip': {
                                                padding: 'var(--pm-16)',
                                            }
                                        }} title={
                                            <>

                                                <PriceDetail amounts={itinerarie.amounts} familyCode={chooseAmountCode} currency={currency} />
                                            </>
                                        }>
                                            <Typography fontWeight="bold" fontSize="1.1rem" display="inline" sx={{
                                                fontSize: 20,
                                                color: 'var(--active-color)',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    cursor: 'help',

                                                }
                                            }}>{currency}${totalPriceChoose}</Typography>
                                        </HtmlTooltip>
                                    </div>
                                    <Typography variant="caption" color="text.secondary" ml={1}
                                                sx={{fontSize: 14}}>{itineraryTypeMap[itineraryType]}</Typography>
                                </Box>:
                                <></>
                        }
                        <Button
                            variant='contained'
                            fullWidth
                            size="large"
                            sx={{
                                backgroundColor: 'var(--active-color)',
                                fontSize:20,
                                ml:'20px',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#264fd3' },
                            }}
                            onClick={submitResult}
                        >
                            Continue
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>
        </div>
    )
})

const FilterData = memo(() => {
    const state = useSelector((state: RootState) => state)
    const airportList = useSelector((state: RootState) => state.ordersInfo.airportList)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const dispatch = useDispatch()

    const prevAir = useMemo(() => {
        if(!airChoose.result || airportActived < 1) return null
        const segment = airChoose.result.itineraries[airportActived - 1].segments
        return segment
    }, [airChoose.result,airportActived]);

    const updatedTime = useMemo(() => {
        if(!state.ordersInfo.airportList.length){
            return ''
        }
        const time = state.ordersInfo.airportList[0].updatedTime
        return dayjs(time).format('HH:mm:ss') || ''
    }, [state.ordersInfo.airportList,airportActived]);

    const prevChooseAir = () => {
        dispatch(prevAirChoose())
    }


    return (
        <div className={`${styles.filterData} flex-1`}>
            <div className={styles.filterBox}>
                {
                    airportList.length?
                        <>
                            <div className={styles.filterHeader}>
                                <div className={styles.stackedColor}></div>
                                <div className={`s-flex jc-bt ai-ct ${styles.filterHeaderTitle}`}>
                                    <h2>
                                        {
                                            airportList.length && state.ordersInfo.query.itineraries.length?
                                                `${airportActived + 1}. Departing to ${state.ordersInfo.query.itineraries[airportActived].arrival}`
                                                :<></>
                                        }
                                    </h2>
                                    <div className={`s-flex ai-fs cursor-p`}>
                                        <span>*Last updated: {updatedTime}</span>
                                    </div>
                                </div>
                                {
                                    prevAir ?
                                        <div className={`${styles.prevCom} s-flex jc-bt ai-ct`}>
                                            <div className={`${styles.prevComInfo} s-flex ai-ct`}>
                                                <Chip label="Depart" size={'small'} sx={{
                                                    background: 'var(--active-color)',
                                                    borderRadius: '4px',
                                                    fontSize: '1rem',
                                                    color: 'var(--vt-c-white)',
                                                    fontWeight: 'bold',
                                                    '.MuiChip-label': {
                                                        fontSize: '1.2em',
                                                    }
                                                }}/>
                                                {
                                                    prevAir.map(segment => (
                                                        <div className={styles.airInfos} key={segment.flightNumber}>
                                                            <span>{format(segment.departureTime, 'EEE, MMM dd')}</span>
                                                            <span>{extractTimeWithTimezone(segment.departureTime)} – {extractTimeWithTimezone(segment.arrivalTime!)}</span>
                                                            <span>{segment.departureAirport} – {segment.arrivalAirport}</span>
                                                            <span>{formatFlyingTime(segment.totalFlyingTime!)}</span>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className={`${styles.firportSet} cursor-p s-flex ai-ct`} onClick={prevChooseAir}>
                                                <span>Change Flight</span>
                                            </div>
                                        </div>
                                        :<></>
                                }

                            </div>
                            {/*<FilterTab />*/}
                            <div className={styles.filterContent}>
                                {
                                    state.ordersInfo.airportList.map((airport) => {
                                        return airport.results.map(result => {
                                            return result.itineraries.filter(itinerarie => itinerarie.itineraryNo === airportActived).map(itinerarie => (
                                                <FilterItem key={`${airport.channelCode}-${result.resultKey}-${itinerarie.itineraryKey}`}
                                                            itinerarie={itinerarie}
                                                            channelCode={airport.channelCode}
                                                            resultType={result.resultType}
                                                            policies={result.policies}
                                                            contextId={result.contextId}
                                                            resultKey={result.resultKey}
                                                            currency={result.currency} />
                                            ))
                                        })
                                    })
                                }
                            </div>
                        </>:<></>
                }

            </div>
        </div>
    )
})

export default FilterData;
