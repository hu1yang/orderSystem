import {Box, Checkbox, Divider, FormControlLabel, FormGroup, Slider, SliderThumb, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import styles from './styles.module.less'
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {airlist, debounce} from "@/utils/public.ts";
import defaultAir from "@/assets/air/default.webp";
import {setFilterData} from "@/store/orderInfo.ts";
import {useTranslation} from "react-i18next";


type AirbnbThumbComponentProps = React.HTMLAttributes<HTMLSpanElement> & {
    'data-index'?: string;
    ownerState: {
        value: number[];
    };
};

const AirbnbThumbComponent = memo((props: AirbnbThumbComponentProps) => {
    const {children, ...other} = props;
    const dataIndex = Number(other['data-index']);
    const index = dataIndex;
    const value = props.ownerState.value;

    const showSun =
        (index === 0 && value[0] > 6) ||
        (index === 1 && value[1] <= 18);

    return (
        <SliderThumb {...other}>
            {children}
            {showSun ? (
                <BrightnessLowIcon sx={{fontSize: 14}}/>
            ) : (
                <Brightness2Icon sx={{fontSize: 14}}/>
            )}
        </SliderThumb>
    );
})

const FilterAccordion = memo(({title, render,clear,clearFilter}: {
    title: string;
    render: React.ReactNode
    clear:boolean
    clearFilter?:() => void
}) => {
    const {t} = useTranslation()

    const [open, setOpen] = useState(true)

    const clearFnc = (event:React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if(clearFilter){
            clearFilter()
        }
    }

    return (
        <div className={styles.filterAccordion}>
            <div className={`${styles.filterHeader} s-flex jc-bt ai-ct cursor-p`} onClick={() => setOpen(!open)}>
                <div className={styles.filterTitle}>
                    <span>{title}</span>
                </div>
                <div className={`s-flex ai-ct cursor-p`}>
                    {
                        clear && (
                            <Box
                                onClick={clearFnc}
                                sx={{
                                    cursor: 'pointer', color: 'var(--active-color)', '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                {t('order.clear')}
                            </Box>
                        )
                    }
                    <ExpandMoreIcon sx={{
                        fontSize: 24,
                        fontWeight: 400,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform .3s ease'
                    }} style={{}}/>
                </div>
            </div>
            <div className={styles.filterCheckBox} style={{
                display: open ? 'block' : 'none',
            }}>
                {render}
            </div>
        </div>
    )
})

const RecommendedCheckboxList = () => {
    const dispatch = useDispatch()

    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)
    const filterData = useSelector((state: RootState) => state.ordersInfo.filterData)
    const alineList = useMemo(() => [...new Set(airSearchData.map(i => i.channelCode))],[airSearchData])

    const handleChange = (val:string) => {
        const value = filterData.airline.includes(val)
            ? filterData.airline.filter(v => v !== val)
            : [...filterData.airline, val]
        dispatch(setFilterData({
            airline: value
        }))
    }

    return (
        <FormGroup>
            {alineList.map((item) => (
                <FormControlLabel
                    key={item}
                    control={
                        <Checkbox
                            checked={filterData.airline.includes(item)}
                            onChange={() => handleChange(item)}
                            sx={{
                                'svg': {
                                    fontSize: 24,
                                    fill: 'var(--text-color)'
                                }
                            }}
                        />
                    }
                    label={
                        <div className={`${styles.checkLabel} s-flex ai-ct`}>
                            <div className={`${styles.icons} s-flex ai-ct`}>
                                <img src={airlist[item]?.picture ?? defaultAir} alt=""/>
                            </div>
                            <span>{airlist[item].title}</span>
                        </div>
                    }
                    sx={{
                        borderRadius: 'var(--put-border-raduis)',
                        marginRight: 0,
                        marginLeft: 0,
                        marginTop: '5px',
                        '&:hover': {
                            backgroundColor: 'var(--vt-c-white)',
                        }
                    }}
                />
            ))}
        </FormGroup>
    )
}

// --- 新增组件: 时间滑块复用 ---
const TimeRangeSlider = memo(({label,filterTimevalue,changeFilterTimeFnc,disabled}: {
    label: string
    filterTimevalue: number[]
    changeFilterTimeFnc: (val:number[]) => void
    disabled:boolean
}) => {
    const formatTime = (v: number) => String(v).padStart(2, '0') + ':00';

    const [slider, setSlider] = useState([0,24])

    useEffect(() => {
        setSlider(filterTimevalue)
    }, [filterTimevalue]);
    return (
        <Box sx={{width: '100%', mx: 'auto'}}>
            <Typography gutterBottom className={`${styles.timerTitle} s-flex ai-ct`}>
                <span>{label}</span>
                <span>
                    {formatTime(slider[0])} – {formatTime(slider[1])}
                </span>
            </Typography>
            <Slider
                value={slider}
                disabled={disabled}
                onChange={(_, newValue) => {
                    let [start, end] = newValue as number[];
                    start = Math.min(start, 24);
                    end = Math.max(end, 0);
                    if (start > end) start = end;
                    setSlider([start, end]);
                }}
                onChangeCommitted={(_, newValue) => {
                    let [start, end] = newValue as number[];
                    start = Math.min(start, 24);
                    end = Math.max(end, 0);
                    if (start > end) start = end;
                    changeFilterTimeFnc([start, end])
                }}
                min={0}
                max={24}
                step={1}
                marks={[
                    {value: 0, label: '00:00'},
                    {value: 6, label: ''},
                    {value: 12, label: ''},
                    {value: 18, label: ''},
                    {value: 24, label: '24:00'},
                ]}
                getAriaValueText={formatTime}
                valueLabelFormat={formatTime}
                valueLabelDisplay="auto"
                slots={{thumb: AirbnbThumbComponent}}
                sx={{
                    '& .MuiSlider-rail': {
                        height: 4,
                        border: 'none',
                        opacity: 1,
                        background:
                            'linear-gradient(90deg, #1136a6, #ffb64d 24%, #ffb64d 26%, #ffdd39 49%, #ffdd39 51%, #ffb64d 74%, #ffb64d 76%, #1136a6)',
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'transparent',
                        border: 'none',
                    },
                    '& .MuiSlider-thumb': {
                        height: 16,
                        width: 16,
                        backgroundColor: 'var(--vt-c-white)',
                        border: 'none',
                        '&:hover': {
                            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                            width: 18,
                            height: 18,
                        },
                        '& .airbnb-bar': {
                            height: 9,
                            width: 1,
                            backgroundColor: 'currentColor',
                            marginLeft: 1,
                            marginRight: 1,
                        },
                    },
                }}
            />
        </Box>
    );
});

const FilterComponent = memo(() => {
    const {t} = useTranslation();
    const dispatch = useDispatch()

    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const searchLoad = useSelector((state: RootState) => state.searchInfo.searchLoad)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const cityList = useSelector((state: RootState) => state.ordersInfo.cityList)
    const filterData = useSelector((state: RootState) => state.ordersInfo.filterData)


    const arrival = useMemo(() => {
        const arrivalValue = query.itineraries.find(its => its.itineraryNo === airportActived)?.arrival
        const result = cityList.find(city => city.cityCode === arrivalValue || city.airportCode === arrivalValue)
        return result?.airportEName ?? arrivalValue
    }, [query,airportActived,cityList]);

    const changeFilterTime = useCallback(
        debounce((value: number[], index: number, type: 'arrival' | 'departure') => {
            dispatch(
                setFilterData({
                    filterTime: filterData.filterTime.map((fl, flIndex) => {
                        if (flIndex === index) {
                            return {
                                ...fl,
                                [type]: value, // ← 创建新对象，保证不可变
                            }
                        }
                        return fl
                    }),
                })
            )
        },200),
        [filterData]
    )

    const clearFilter = useCallback((index:number) => {
        if(airportActived !== index) return false
        dispatch(
            setFilterData({
                filterTime: filterData.filterTime.map((fl, flIndex) => {
                    if (flIndex === index) {
                        return {
                            departure:[0,24],
                            arrival:[0,24]
                        }
                    }
                    return fl
                }),
            })
        )
    },[filterData,airportActived])

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterbox}>
                <div className={`${styles.titleBox} s-flex ai-ct jc-bt`}>
                    <div className={styles.title}>
                        <span>{t('order.filters')} ({(airportActived === 0) ? t('order.departure') : t('order.arrival')})</span>
                    </div>
                </div>
                <div className={`${styles.filterLiBox} s-flex flex-wrap`}>
                    <div className={`${styles.fliterLi} s-flex ai-st cursor-p`}>
                        <div className={styles.label}>
                            <span>{t('order.departingTo',{airport:arrival})}</span>
                        </div>
                    </div>
                    {
                        filterData.airline.map(item => (
                            <div className={`${styles.fliterLi} s-flex ai-st cursor-p`} key={item}>
                                <div className={styles.label}>
                                    <span>{airlist[item].title}</span>
                                </div>
                            </div>
                        ))
                    }


                </div>
            </div>
            <Divider component="div"/>
            <FilterAccordion title={t('order.airlines')} clear={false} render={<RecommendedCheckboxList/>}/>
            <Divider component="div" />
            {
                !searchLoad && filterData.filterTime.map((filterTime,filterTimeIndex) => (
                    <FilterAccordion
                        title={t('order.timers',{arrival:query.itineraries[filterTimeIndex].arrival})}
                        key={filterTimeIndex}
                        clear={airportActived === filterTimeIndex}
                        clearFilter={() => clearFilter(filterTimeIndex)}
                        render={
                            <>
                                <TimeRangeSlider disabled={filterTimeIndex !== airportActived} filterTimevalue={filterTime.departure} changeFilterTimeFnc={(value:number[]) => changeFilterTime(value,filterTimeIndex,'departure')} label={`${t('order.departureTime')}:`} />
                                <TimeRangeSlider disabled={filterTimeIndex !== airportActived} filterTimevalue={filterTime.arrival} changeFilterTimeFnc={(value:number[]) => changeFilterTime(value,filterTimeIndex,'arrival')} label={`${t('order.arrivalTIme')}:`} />
                            </>
                        }
                    />
                ))
            }

        </div>
    );
})

export default FilterComponent;
