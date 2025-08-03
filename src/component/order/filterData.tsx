import React, {useMemo , memo, useCallback, useState} from "react";
import styles from './styles.module.less'
import {
    Box,
    Chip,
    Tab,
    Tabs,
} from "@mui/material";
import HtmlTooltip from "../defult/Tooltip";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {extractTimeWithTimezone} from "@/utils/public.ts";
import {prevAirChoose} from "@/store/orderInfo.ts";
import {
    formatTotalDuration, getAirResultList,
} from "@/utils/order.ts";
import {format} from "date-fns";
import FilterItem from "@/component/order/filterItem.tsx";
import FilterItemSkeleton from "@/component/order/filterItemSkeleton.tsx";


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


const FilterData = memo(() => {
    const state = useSelector((state: RootState) => state)
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const dispatch = useDispatch()

    const prevAir = useMemo(() => {
        if(!airChoose.result || airportActived < 1) return null
        const segment = airChoose.result.itineraries[airportActived - 1].segments
        return segment
    }, [airChoose.result,airportActived]);

    // const updatedTime = useMemo(() => {
    //     if(!state.ordersInfo.airportList.length){
    //         return ''
    //     }
    //     const time = state.ordersInfo.airportList[0].updatedTime
    //     return dayjs(time).format('HH:mm:ss') || ''
    // }, [state.ordersInfo.airportList,airportActived]);

    const airResultList = useMemo(() => {
        return getAirResultList({airSearchData, airportActived, airChoose})
    }, [airSearchData, airportActived, airChoose.result]);


    const prevChooseAir = () => {
        dispatch(prevAirChoose())
    }

    return (
        <div className={`${styles.filterData} flex-1`}>

            <div className={styles.filterBox}>

                <div className={styles.filterHeader}>
                    <div className={styles.stackedColor}></div>
                    <div className={`s-flex jc-bt ai-ct ${styles.filterHeaderTitle}`}>
                        <h2>
                            {
                                state.ordersInfo.query.itineraries.length?
                                    `${airportActived + 1}. ${(airportActived === 0) ? 'Departing' : 'Returning'} to ${state.ordersInfo.query.itineraries[airportActived].arrival}`
                                    :<></>
                            }
                        </h2>
                        <div className={`s-flex ai-fs cursor-p`}>
                            {/*<span>*Last updated: {updatedTime}</span>*/}
                        </div>
                    </div>
                    {
                        prevAir ?
                            <div className={`${styles.prevCom} s-flex jc-bt ai-ct`}>
                                <div className={`${styles.prevComInfo} s-flex ai-ct`}>
                                    <Chip label={(airportActived === 0) ? 'Depart':'Return'} size={'small'} sx={{
                                        background: 'var(--active-color)',
                                        borderRadius: '4px',
                                        fontSize: '1rem',
                                        color: 'var(--vt-c-white)',
                                        fontWeight: 'bold',
                                        '.MuiChip-label': {
                                            fontSize: '1.2em',
                                        }
                                    }}/>
                                    <div className={styles.airInfos}>
                                        <span>{format(prevAir[0].departureTime, 'EEE, MMM dd')}</span>
                                        <span>{extractTimeWithTimezone(prevAir[0].departureTime)} – {extractTimeWithTimezone(prevAir.at(-1)?.arrivalTime as string)}</span>
                                        <span>{prevAir[0].departureAirport} – {prevAir.at(-1)?.arrivalAirport}</span>
                                        <span>{formatTotalDuration(prevAir.map(segment => segment.totalFlyingTime) as string[])}</span>
                                    </div>
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
                        airSearchData.length ? (
                            airResultList.map((searchData) => (
                                <FilterItem
                                    key={`${searchData.key}-${searchData.itineraryKey}`}
                                    segments={searchData.segments}
                                    cheapAmount={searchData.cheapAmount}
                                    currency={searchData.currency!}
                                    searchKey={searchData.key}
                                />
                            ))
                        ):<FilterItemSkeleton />
                    }
                </div>
            </div>
        </div>
    )
})

export default FilterData;
