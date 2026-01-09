import React, {useMemo , memo, useState} from "react";
import styles from './styles.module.less'
import {
    Box,
    Chip,
    Tab,
    Tabs, Typography,
} from "@mui/material";
import HtmlTooltip from "../defult/Tooltip";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {extractTimeWithTimezone, formatLocale} from "@/utils/public.ts";
import {prevAirChoose} from "@/store/orderInfo.ts";
import {
    formatTotalDuration,
} from "@/utils/order.ts";
import FilterItem from "@/component/order/filterItem.tsx";
import FilterItemSkeleton from "@/component/order/filterItemSkeleton.tsx";
import {SearchDataProvider} from "@/context/order/SearchDataContext.tsx";
import dayjs from '@/utils/dayjs.ts';
import isBetween from 'dayjs/plugin/isBetween';
import {useTranslation} from "react-i18next";
dayjs.extend(isBetween);


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

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    }

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
    const {t} = useTranslation()

    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const filterData = useSelector((state: RootState) => state.ordersInfo.filterData)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const airChoose = useSelector((state: RootState) => state.ordersInfo.airChoose)
    const noData = useSelector((state: RootState) => state.ordersInfo.noData)
    const disabledChoose = useSelector((state: RootState) => state.ordersInfo.disabledChoose)
    const searchLoad = useSelector((state: RootState) => state.searchInfo.searchLoad)
    const cityList = useSelector((state: RootState) => state.ordersInfo.cityList)
    const itineraries = useSelector((state: RootState) => state.ordersInfo.query.itineraries)

    const dispatch = useDispatch()

    const prevAir = useMemo(() => {
        if(!airChoose.result || airportActived < 1) return null
        const segment = airChoose.result.itineraries[airportActived - 1].segments
        return segment
    }, [airChoose.result,airportActived]);

    const filterDatas = useMemo(() => {
        return airSearchData
        // 1. 航司过滤
        .filter(a => filterData.airline.includes(a.channelCode))
        // 2. 筛选 itinerariesMerge 内部数据
        .map(a => {
            const filteredItineraries = a.itinerariesMerge.filter(im => {
                if (im.itineraryNo !== airportActived) return true;

                const { departure, arrival } = filterData.filterTime[im.itineraryNo];
                const [depMin, depMax] = departure;
                const [arrMin, arrMax] = arrival;

                // 跳过筛选的情况
                const noDep = depMin === 0 && depMax === 24;
                const noArr = arrMin === 0 && arrMax === 24;

                if (noDep && noArr) return true; // 不筛选

                const segmentsSort = [...im.segments].sort(
                    (x, y) => x.sequenceNo - y.sequenceNo
                );

                const depTime = dayjs(segmentsSort[0].departureTime);
                const arrTime = dayjs(segmentsSort[segmentsSort.length - 1].arrivalTime);

                // 构造筛选时间点（当天日期 + 指定小时）
                const depMinTime = depTime.startOf('day').add(depMin, 'hour');
                const depMaxTime = depTime.startOf('day').add(depMax, 'hour');
                const arrMinTime = arrTime.startOf('day').add(arrMin, 'hour');
                const arrMaxTime = arrTime.startOf('day').add(arrMax, 'hour');

                const includedD = noDep || depTime.isBetween(depMinTime, depMaxTime, null, '[]');
                const includedA = noArr || arrTime.isBetween(arrMinTime, arrMaxTime, null, '[]');

                return includedD && includedA;
            });

            return {
                ...a,
                itinerariesMerge: filteredItineraries,
            };
        })
        .filter(a => a.itinerariesMerge.length > 0);
    }, [airSearchData, filterData, airportActived]);

    const airItem = useMemo(() => {
        let source = filterDatas;

        if (airChoose.channelCode && airChoose.result) {
            source = source.filter(
                air =>
                    air.channelCode === airChoose.channelCode &&
                    air.contextId === airChoose.result?.contextId &&
                    air.resultKey === airChoose.result?.resultKey
            );
        }

        const result = source
            .flatMap(({ itinerariesMerge, ...rest }) =>
                itinerariesMerge
                .filter(it => it.itineraryNo === airportActived)
                .map(it => ({
                    ...rest,
                    segments: it.segments,
                    itineraryNo: it.itineraryNo,
                    amountsMerge: it.amountsMerge,
                }))
            );
        return result ?? [];
    }, [airportActived, airChoose,filterDatas]);

    const prevChooseAir = () => {
        dispatch(prevAirChoose())
    }

    const arrival = useMemo(() => {
        const arrivalValue = itineraries[airportActived].arrival
        const result = cityList.find(city => city.cityCode === arrivalValue || city.airportCode === arrivalValue)
        return result?.airportEName ?? arrivalValue
    },[cityList,itineraries,airportActived])


    const renderContent = () => {
        if (disabledChoose || searchLoad) {
            return <FilterItemSkeleton />;
        }

        if (noData || airItem?.length === 0) {
            return (
                <Box component="section" sx={{ p: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        {t('order.noData')}
                    </Typography>
                </Box>
            );
        }

        return (
            <div className={styles.filterContent}>
                {airItem.map((searchData, searchDataIndex) => (
                    <SearchDataProvider
                        value={searchData}
                        key={searchDataIndex}
                    >
                        <FilterItem />
                    </SearchDataProvider>
                ))}
            </div>
        );
    };

    return (
        <div className={`${styles.filterData} flex-1`}>
            <div className={styles.filterBox}>
                <div className={styles.filterHeader}>
                    <div className={styles.stackedColor}></div>
                    <div className={`s-flex jc-bt ai-ct ${styles.filterHeaderTitle}`}>
                        <h2>
                            {
                                itineraries.length &&
                                    `${airportActived + 1}. ${(airportActived === 0) ? t('order.departingTo',{airport:arrival}) : t('order.returningTo',{airport:arrival})}`
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
                                    <Chip label={(airportActived === 0) ? t('order.depart'):t('order.return')} size={'small'} sx={{
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
                                        <span>{formatLocale(prevAir[0].departureTime, 'EEE, MMM dd')}</span>
                                        <span>{extractTimeWithTimezone(prevAir[0].departureTime)} – {extractTimeWithTimezone(prevAir.at(-1)?.arrivalTime as string)}</span>
                                        <span>{prevAir[0].departureAirport} – {prevAir.at(-1)?.arrivalAirport}</span>
                                        <span>{formatTotalDuration(prevAir.map(segment => segment.totalFlyingTime) as string[])}</span>
                                    </div>
                                </div>
                                <div className={`${styles.firportSet} cursor-p s-flex ai-ct`} onClick={prevChooseAir}>
                                    <span>{t('passenger.changeFlight')}</span>
                                </div>
                            </div>
                            :<></>
                    }

                </div>
                {/*<FilterTab />*/}
                {renderContent()}
            </div>
        </div>
    )
})

export default FilterData;
