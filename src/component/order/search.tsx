import {
    Button,
    Divider, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Popover,
    Radio,
    RadioGroup, Select, Stack,
    Typography
} from '@mui/material';
import styles from './styles.module.less'
import {memo, useCallback, useMemo, useRef, useState} from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchIcon from '@mui/icons-material/Search';
import * as React from "react";
import {format} from 'date-fns';

import {DayPicker, type DateRange} from "react-day-picker";
import "react-day-picker/style.css";

import type {
    Country,
    FQuery, IAirport, ITem,
    ItineraryType,
    PassengerType,
} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import {
    resetAirChoose, setCityArr, setFilterData, setNoData,
    setQuery, setSearchDate
} from "@/store/orderInfo.ts";
import {fuzzyQueryGlobalAirportsAgent} from "@/utils/request/agent.ts";
import dayjs from "dayjs";
import {getAgentQuery} from "@/utils/order.ts";
import {cabinOptions, debounce, flattenByCountry} from "@/utils/public.ts";
import type {RootState} from "@/store";
import {
    addSearch, delSearch,
    setCabinValue,
    setDaValue, setErrorMsg,
    setLocalDate,
    setRadioType, setSearchFlag,
    setSearchLoad,
    setTravelers
} from "@/store/searchInfo.ts";




function setHistorySearch(newItem: ITem) {
    const key = 'historySearch';
    const stored = localStorage.getItem(key);
    let history: typeof newItem[] = [];

    if (stored) {
        try {
            history = JSON.parse(stored);
        } catch {
            history = [];
        }
    }

    // 插入前去重
    history = history.filter(item => {
        if (item.itineraryType !== newItem.itineraryType) return true; // 不同类型保留

        // 对比每一程
        const lengthMatch = item.itineraries.length === newItem.itineraries.length;
        if (!lengthMatch) return true;

        const allMatch = item.itineraries.every((oldItin, index) => {
            const newItin = newItem.itineraries[index];
            return !(
                oldItin.departure.airportCode === newItin.departure.airportCode &&
                oldItin.arrival.airportCode === newItin.arrival.airportCode &&
                oldItin.departureDate === newItin.departureDate
            );
        });

        return allMatch; // 如果 allMatch 为 false，说明重复，需要过滤掉
    });

    // 插入新项到最前
    history.unshift(newItem);

    // 限制最多 3 项
    if (history.length > 3) {
        history = history.slice(0, 3);
    }

    localStorage.setItem(key, JSON.stringify(history));
}


const AddressCard = memo(({style,address}:{style?:React.CSSProperties,address:IAirport}) => (
    <div className={`${styles.addressCard} cursor-p`} style={style}>
        {
            !!address &&  <div className={'full-width'}>
                <span className={'elli-1'}>{address.cityEName}({address.airportCode})</span>
                <p className={'elli-1'}>{address.airportEName}</p>
            </div>
        }
    </div>
))

const InputModel = memo(({children,openPop,style}:{
    children:React.ReactNode,
    openPop?:(current:React.MouseEvent<HTMLDivElement>) => void;
    style?:React.CSSProperties;
}) => {

    const clickPop = (event:React.MouseEvent<HTMLDivElement>) => {
        if(openPop){
            openPop(event)
        }
    }

    return (
        <div className={`${styles.inputModel} cursor-p s-flex ai-ct jc-bt flex-1`} style={style} onClick={clickPop}>
            {children}
        </div>
    )
})

const InputPop = memo(({id,open,anchorEl,closePop,children}:{
    id:string|undefined;
    open:boolean;
    anchorEl:HTMLElement;
    closePop:() => void;
    children:React.ReactNode;
}) => (
    <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        onClose={closePop}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        sx={{
            marginTop: 'calc(var(--pm-16) * -1)',
            marginLeft: 'calc(var(--pm-16) * -1)',
            pointerEvents: open?'auto':'none'
        }}
        container={document.body}
        disableEnforceFocus
        disableAutoFocus>
        {children}
    </Popover>
))

const Airports = memo(({index}:{
    index:number;
}) => {
    const searchQuery = useSelector((state: RootState) => state.searchInfo.searchQuery)

    const daValue = useMemo(() => searchQuery[index].daValue,[searchQuery,index])

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const [types, setTypes] = useState<'departure'|'arrival'>('departure')


    const inputRef = useRef<HTMLInputElement|null>(null);

    const openPop = useCallback((event:React.MouseEvent<HTMLDivElement>,type:'departure'|'arrival') => {
        setTypes(type)
        setAnchorEl(event.currentTarget)
        setTimeout(() => {
            if(inputRef.current){
                inputRef.current.focus();
            }
        },0)
    },[])

    const closePop = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
        setTypes('departure')
    },[])

    const handleInput = (airport: IAirport) => {
        dispatch(setDaValue({
            value:{
                ...daValue,
                [types]:airport
            },
            index
        }))
        closePop()
    }

    const [searchList, setSearchList] = useState<Country[]>([])

    const searchCity = debounce((value: string) => {
        if(!value) {
            setSearchList([])
            return
        }
        fuzzyQueryGlobalAirportsAgent(value).then(res => {
            setSearchList(flattenByCountry(res))
        })
    }, 300)

    const handleEnter = () => {
        const firstCountry = searchList[0]
        const firstCity = firstCountry?.cities?.[0]
        const firstAirport = firstCity?.airports?.[0]

        if (firstAirport && firstCity && firstCountry) {
            handleInput({
                airportEName: firstAirport.airportEName,
                airportCName: firstAirport.airportCName,
                airportCode: firstAirport.airportCode,
                cityCName: firstCity.cityCName,
                cityCode: firstCity.cityCode,
                cityEName: firstCity.cityEName
            })
        }
    }

    return (
        <div className={`s-flex s-flex ai-ct`}>
            <InputModel openPop={(event) => openPop(event,'departure')}>
                {
                    daValue.departure ? <AddressCard address={daValue.departure} /> : <Typography sx={{color:'var(--put-border-color)',fontWeight:600,fontSize:14,ml:'1rem'}}>Leaving from</Typography>
                }
            </InputModel>
            <div className={`${styles.cycleAddress} s-flex ai-ct jc-ct cursor-p`} onClick={() =>  dispatch(setDaValue({
                value:{
                    departure:daValue.arrival || null,
                    arrival:daValue.departure || null
                },
                index
            }))}>
                <ConnectingAirportsIcon />
            </div>
            <InputModel openPop={(event) => openPop(event,'arrival')}>
                {
                    daValue.arrival ? <AddressCard style={{marginLeft: '4px'}} address={daValue.arrival} /> : <Typography sx={{color:'var(--put-border-color)',fontWeight:600,fontSize:14,ml:'1rem'}}>Going to</Typography>
                }
            </InputModel>
            <InputPop id='searchInputPop' open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.popBox}>
                    <div className={styles.popBoxSearch}>
                        <InputModel style={{width: '100%'}}>
                            <input type="text" ref={inputRef} onChange={(e) => searchCity(e.currentTarget.value)}
                                   onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                           // 用户按下了 Enter
                                           handleEnter(); // 替换成你的逻辑函数
                                       }
                                   }}
                                   className={`${styles.inputBox} flex-1`} />
                        </InputModel>
                    </div>
                    <Divider />
                    <div className={styles.popScroll}>
                        {/*<div className={styles.currentAddress}>*/}
                        {/*    <div className={styles.currentAddressTitle}>*/}
                        {/*        <span>Recent Searches</span>*/}
                        {/*    </div>*/}
                        {/*    <div className={styles.addressBox}>*/}
                        {/*        <Grid container spacing={2}>*/}
                        {/*            <Grid size={4}>*/}
                        {/*                <div className={`${styles.addressItem} s-flex ai-ct jc-ct cursor-p`}>*/}
                        {/*                    <AddLocationIcon />*/}
                        {/*                    <span>Beijing</span>*/}
                        {/*                </div>*/}
                        {/*            </Grid>*/}

                        {/*        </Grid>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<Divider />*/}
                        {
                            searchList.map((region) => (
                                <div key={region.countryCode}>
                                    <div className={styles.addressArea}>
                                        <span>{region.countryEName}</span>
                                    </div>

                                    {
                                        region.cities.map(city => (
                                            <div className={styles.addressBox} key={city.cityCode}>
                                                <Grid container spacing={2}>
                                                    <Grid>
                                                        <div
                                                            onClick={() => handleInput({
                                                                airportEName:city.cityEName,
                                                                airportCName:city.cityCName,
                                                                airportCode:city.cityCode,
                                                                cityCName:city.cityCName,
                                                                cityCode:city.cityCode,
                                                                cityEName:city.cityEName
                                                            })}
                                                            className={`${styles.addressItem} s-flex flex-dir ai-fs jc-ct cursor-p`}>
                                                            <span>{city.cityCName}({city.cityCode})</span>
                                                            <span>{city.cityEName}(City)</span>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                                <div className={styles.addressBox}>
                                                    <Grid container spacing={2}>
                                                        {
                                                            city.airports.map(airport => (
                                                                <Grid key={airport.airportCode}>
                                                                    <div
                                                                        onClick={() => handleInput({
                                                                            airportEName:airport.airportEName,
                                                                            airportCName:airport.airportCName,
                                                                            airportCode:airport.airportCode,
                                                                            cityCName:city.cityCName,
                                                                            cityCode:city.cityCode,
                                                                            cityEName:city.cityEName
                                                                        })}
                                                                        className={`${styles.addressItem} ${styles.addressItemli} s-flex flex-dir ai-fs jc-ct cursor-p`}>
                                                                        <span>{airport.airportCName}({airport.airportCode})</span>
                                                                        <span>{airport.airportEName}</span>
                                                                    </div>
                                                                </Grid>
                                                            ))
                                                        }
                                                    </Grid>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </InputPop>
        </div>
    )
})

const TimerChoose = memo(({isRound,index}:{
    isRound: boolean
    index:number
}) => {
    const searchQuery = useSelector((state: RootState) => state.searchInfo.searchQuery)
    const localDate = useMemo(() => searchQuery[index].localDate,[searchQuery,index])

    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)

    const openPop = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])

    const closePop = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setAnchorEl(null)
    }, [])


    const disabledTimer = useMemo(() => {
        if (searchQuery.length) {
            if (index === 0) {
                // 第一个航段：不能选今天之前
                return dayjs().subtract(1, 'day').toDate()
            }

            // 其它航段：取 index 之前的最大 localDate
            const timestamps = searchQuery
            .slice(0, index) // 取 index 之前
            .filter(item => item.localDate)
            .map(item => dayjs(item.localDate as string).valueOf())

            if (timestamps.length) {
                return new Date(Math.max(...timestamps))
            }

            // 如果前面都没选日期，也回退到今天
            return dayjs().startOf('day').toDate()
        }

        return new Date()
    }, [index, searchQuery])

    const [dayChoose, setDayChoose] = useState(1)

    const handleDayClick = useCallback((day: Date) => {
        if(dayChoose === 1){
            setDayChoose(2)
            dispatch(setLocalDate({
                timer:{
                    from: dayjs(day as Date).format('YYYY-MM-DD'),
                    to: dayjs(day as Date).format('YYYY-MM-DD'),
                },
                index
            }))
        }
    },[index,dayChoose,dispatch])

    const handleSelect = useCallback((val: DateRange | Date | undefined) => {
        if (!val) return
        if(isRound){
            const {to,from} = val as DateRange
            if(dayChoose === 2){
                dispatch(setLocalDate({
                    timer:{
                        from: dayjs(from as Date).format('YYYY-MM-DD'),
                        to: dayjs(to as Date).format('YYYY-MM-DD'),
                    },
                    index
                }))
                setDayChoose(1)
                closePop()
            }
        }else{
            dispatch(setLocalDate({
                timer:dayjs(val as Date).format('YYYY-MM-DD'),
                index
            }))
            closePop()
        }
    },[index,dispatch,dayChoose,isRound,closePop])

    const formatRange = useMemo(() => {
        if(!isRound){
            return <p>{localDate && format(new Date(localDate as string) as Date, 'EEE, MMM dd')}</p>
        }else{
            const {from,to} = localDate as {
                to:string
                from:string
            }
            return (
                <>
                    <p>{from && format(new Date(from), 'EEE, MMM dd')}</p>
                    <p>-</p>
                    <p>{to && format(new Date(to), 'EEE, MMM dd')}</p>
                </>
            )
        }
    }, [isRound, localDate])

    return (
        <>
            <InputModel openPop={openPop}>
                <div className={`${styles.inputMessage} s-flex jc-ad flex-row ai-ct full-width`}>
                    {!localDate ? <Typography sx={{color:'var(--put-border-color)',fontWeight:600,fontSize:14}}>Choose date</Typography> : formatRange}
                </div>
            </InputModel>
            <InputPop id={'dayPicker'} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.dateClass}>
                    {
                        isRound ? (
                            <DayPicker
                                mode="range"
                                selected={{
                                    to: new Date((localDate as {
                                        to:string
                                        from:string
                                    }).to),
                                    from: new Date((localDate as {
                                        to:string
                                        from:string
                                    }).from),
                                }}
                                onDayClick={handleDayClick}
                                onSelect={handleSelect}
                                disabled={{ before: disabledTimer }}
                                defaultMonth={localDate ? new Date((localDate as {
                                    to:string
                                    from:string
                                }).from) : disabledTimer}
                                numberOfMonths={2}
                                fixedWeeks
                            />
                        ) : (
                            <DayPicker
                                mode="single"
                                selected={new Date(localDate as string)}
                                onSelect={handleSelect}
                                disabled={{ before: disabledTimer }}
                                defaultMonth={localDate ? new Date(localDate as string) : disabledTimer}
                                numberOfMonths={1}
                                fixedWeeks
                            />
                        )
                    }
                    {/*<div className={`s-flex jc-fe`}>*/}
                    {/*    <Button onClick={closePop} variant="contained" sx={{*/}
                    {/*        backgroundColor: 'var(--back-color)',*/}
                    {/*    }}>Choose</Button>*/}
                    {/*</div>*/}
                </div>
            </InputPop>
        </>
    )
})

const PersonChoose = () => {
    const cabinValue = useSelector((state: RootState) => state.searchInfo.cabinValue)
    const travelers = useSelector((state: RootState) => state.searchInfo.travelers)

    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const openPop = useCallback((event:React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    },[])

    const canbinLabel = useMemo(() => {
        const cabinOption = cabinOptions.find(op => op.value === cabinValue)
        return cabinOption?.label.split(' Class') ?? 'Economy'
    }, [cabinValue]);

    const closePop = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
    },[])

    const countAll = useMemo(() => {
        return travelers.reduce((sum, t) => sum + t.passengerCount, 0)
    }, [travelers]);

    const PersonChild = () => (
        <div className={`${styles.inputMessage} s-flex jc-ct ai-ct`}>
            {
                countAll > 1 ? <PeopleAltIcon sx={{fontSize: 24}} /> : <PersonIcon sx={{fontSize: 24}} />
            }
            <p style={{marginLeft: '10px'}}>{countAll} Passengers , {canbinLabel}</p>
        </div>
    )

    const Counter = memo(({value}:{
        value:PassengerType;
    }) => {
        const traveler = useMemo(() => {
            return travelers.find(a => a.passengerType === value)
        }, [value]);

        const setCount = (type: 'prev' | 'reduce') => {
            if (!traveler) return

            let count = traveler.passengerCount

            if (type === 'prev') {
                count = count + 1
            } else {
                count = Math.max(traveler.passengerType === 'adt' ? 1 : 0, count - 1)
            }
            dispatch(setTravelers({
                ...traveler,
                passengerCount: count,
            }))
        }

        return (
            <Stack direction="row" spacing={2} alignItems="center">
                <IconButton color="primary" disabled={!traveler?.passengerCount && true} onClick={() => setCount('reduce')}>
                    <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{traveler?.passengerCount}</Typography>
                <IconButton color="primary" onClick={() => setCount('prev')}>
                    <AddIcon />
                </IconButton>
            </Stack>
        );
    })

    const PersonCheck = memo(({title,tips,value}:{
        title:string;
        tips:string;
        value:PassengerType;
    }) => (
        <div className={`${styles.personCheck} s-flex ai-ct jc-bt`}>
            <div className={styles.checkLabel}>
                <span>{title}</span>
                <p>{tips}</p>
            </div>
            <Counter value={value} />
        </div>
    ))

    return (
        <>
            <InputModel openPop={openPop}>
                <PersonChild />
                <KeyboardArrowDownIcon sx={{fontSize: 24}} className={`${styles.arrowDownIcon} ${open && styles.open}`} />
            </InputModel>
            <InputPop id={'person'} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.popBox}>
                    <div className={`${styles.popTitle} s-flex jc-fe`}>
                        <PersonChild />
                    </div>
                    <Divider />
                    <div className={styles.personContainer}>
                        <div className={styles.tips}>
                            <span>Please select the exact number of passengers to view the best prices</span>
                        </div>
                        <div className={styles.checkBox}>
                            {
                                travelers.map(traveler => {
                                    switch (traveler.passengerType){
                                        case 'adt':
                                            return <PersonCheck key={traveler.passengerType} title='Adults' tips='12+ years old' value={traveler.passengerType} />
                                        case 'chd':
                                            return <PersonCheck key={traveler.passengerType} title='Children' tips='2–11 years old' value={traveler.passengerType} />
                                        case 'inf':
                                            return <PersonCheck key={traveler.passengerType} title='Infants on lap' tips='Under 2 years old' value={traveler.passengerType} />
                                    }
                                })
                            }
                        </div>
                        <FormControl sx={{  width: '100%' }}>
                            <Select labelId='Cabin' size='small' value={cabinValue} onChange={(event) => dispatch(setCabinValue(event.target.value))} id='Cabin' sx={{ width: '100%' }}>
                                {
                                    cabinOptions.map(option => (
                                        <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </InputPop>
        </>
    )
}


const SearchComponent = () => {
    const dispatch = useDispatch()

    const radioType = useSelector((state: RootState) => state.searchInfo.radioType)
    const cabinValue = useSelector((state: RootState) => state.searchInfo.cabinValue)
    const travelers = useSelector((state: RootState) => state.searchInfo.travelers)
    const searchQuery = useSelector((state: RootState) => state.searchInfo.searchQuery)
    const searchLoad = useSelector((state: RootState) => state.searchInfo.searchLoad)

    const isRound = useMemo(() => radioType === 'round', [radioType])

    const setCity = () => {
        const cityArr: IAirport[] = searchQuery.flatMap(city => {
            const { departure, arrival } = city.daValue
            return [departure, arrival].filter(Boolean) as IAirport[]
        })

        dispatch(setCityArr(cityArr))
    }

    const search = () => {
        if(searchLoad) return
        dispatch(setNoData(false))

        dispatch(resetAirChoose())
        dispatch(setSearchDate([]))
        dispatch(setSearchLoad(true))
        dispatch(setSearchFlag(true))
        dispatch(setFilterData({ airline: [] , filterTime: [] }));

        const result: FQuery = {
            itineraryType: radioType,
            cabinLevel: cabinValue,
            travelers,
            itineraries: [],
        }

        const isAllFilled = searchQuery.every(item => item.daValue.departure && item.daValue.arrival && item.localDate)

        if(!isAllFilled){
            dispatch(setSearchFlag(false))
            dispatch(setSearchLoad(false))
            dispatch(setErrorMsg('Please complete the search field'))
            return
        }

        if (radioType === 'oneWay') {
            const {daValue , localDate} = searchQuery[0]
            result.itineraries = [
                {
                    itineraryNo: 0,
                    arrival: daValue.arrival?.airportCode as string,
                    departure: daValue.departure?.airportCode as string,
                    departureDate: dayjs(new Date(localDate as string)).format('YYYY-MM-DD'),
                },
            ]
        } else if (radioType === 'round') {
            const {daValue , localDate} = searchQuery[0]
            const { from, to } = localDate as {
                to:string
                from:string
            }
            result.itineraries = [
                {
                    itineraryNo: 0,
                    arrival: daValue.arrival?.airportCode as string,
                    departure: daValue.departure?.airportCode as string,
                    departureDate: dayjs(new Date(from)).format('YYYY-MM-DD'),
                },
                {
                    itineraryNo: 1,
                    arrival: daValue.departure?.airportCode as string,
                    departure: daValue.arrival?.airportCode as string,
                    departureDate: dayjs(new Date(to)).format('YYYY-MM-DD'),
                },
            ]
        }else{
            result.itineraries = searchQuery.map((searchVal,searchValIndex) => {
                const {daValue , localDate} = searchVal
                return {
                    itineraryNo: searchValIndex,
                    departureDate: dayjs(new Date(localDate as string)).format('YYYY-MM-DD'),
                    arrival: daValue.arrival?.airportCode as string,
                    departure: daValue.departure?.airportCode as string,
                }
            })
        }

        dispatch(setQuery(result))

        const newQuery = {...result}
        newQuery.travelers = result.travelers.filter(traveler => traveler.passengerCount>0)

        setHistorySearch({
            ...newQuery,
            itineraries: newQuery.itineraries.map((it,itIndex) => ({
                ...it,
                departure: searchQuery[radioType !== 'multi' ? 0 : itIndex].daValue.departure as IAirport,
                arrival: searchQuery[radioType !== 'multi' ? 0 : itIndex].daValue.arrival as IAirport
            }))
        })

        setCity()

        getAgentQuery(newQuery,dispatch)
    }

    return (
        <div className={styles.searchContainer}>
            <div>
                <RadioGroup row value={radioType} onChange={
                    (event) => dispatch(setRadioType(event.target.value as ItineraryType))
                } name="row-radio-buttons-group">
                    <FormControlLabel label="Round-trip" control={<Radio/>} value={'round'}></FormControlLabel>
                    <FormControlLabel label="One-way" control={<Radio/>} value={'oneWay'}></FormControlLabel>
                    <FormControlLabel label="Multi-city" control={<Radio/>} value={'multi'}></FormControlLabel>
                </RadioGroup>
            </div>
            <div>
                <div className={`s-flex jc-bt`}>
                    <div className={`flex-1`}>
                        <Grid container spacing={2}>
                            {
                                searchQuery.map((_,searchValIndex) => (
                                    <Grid size={12} key={searchValIndex}>
                                        <Grid container spacing={1}  sx={{
                                            alignItems: "center",
                                        }}>
                                            <Grid size={6}>
                                                <Airports index={searchValIndex} />
                                            </Grid>
                                            <Grid size={3}>
                                                <TimerChoose isRound={isRound} index={searchValIndex} />
                                            </Grid>
                                            <Grid size={3}>
                                                {
                                                    searchValIndex > 0 ? (
                                                        searchValIndex > 1 && <CancelSharpIcon className={`cursor-p`} onClick={() => dispatch(delSearch(searchValIndex))} sx={{
                                                            color: 'var(--tips-color)',
                                                            fontSize: '1.6rem'
                                                        }}/>
                                                    ) : <PersonChoose/>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </div>
                    <Button variant="contained" onClick={search} loading={searchLoad} sx={{
                        height: 'var(--put-height)',
                        color: 'white',
                        fontSize: '1.2rem',
                        backgroundColor: 'var(--active-color)',
                        ml:'.6rem',
                        '.MuiButton-startIcon': {
                            m:0
                        }
                    }} startIcon={<SearchIcon sx={{width: '1.9rem',height: '1.9rem'}} />}>
                        Search
                    </Button>
                </div>
                {
                    radioType === 'multi' && (
                        <div className={`${styles.addAirBtn} s-flex ai-fs cursor-p`} onClick={() => dispatch(addSearch())}>
                            <AddCircleOutlineOutlinedIcon sx={{color:'var(--active-color)',mr:'10px'}} />
                            <Typography variant="button" gutterBottom sx={{ display: 'block' , fontSize: 12, m:0, fontWeight: 'bold', color:'var(--active-color)' }}>
                                Add another flight
                            </Typography>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default SearchComponent;
