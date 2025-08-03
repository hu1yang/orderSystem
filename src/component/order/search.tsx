import {
    Alert,
    Button,
    Divider, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Popover,
    Radio,
    RadioGroup, Select, Snackbar, Stack,
    Typography
} from '@mui/material';
import styles from './styles.module.less'
import {memo, useCallback, useMemo, useRef, useState} from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import * as React from "react";
import {format} from 'date-fns';


import {DayPicker, type DateRange} from "react-day-picker";
import "react-day-picker/style.css";

import type {
    FilterAirport,
    FQuery, IAirport, ITem,
    ItineraryType,
    PassengerType,
} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import {
    setQuery, setSearchDate
} from "@/store/orderInfo.ts";
import {fuzzyQueryGlobalAirportsAgent, getAuthorizableRoutingGroupAgent} from "@/utils/request/agetn.ts";
import dayjs from "dayjs";
import {deduplicateByChannelCode} from "@/utils/order.ts";
import {debounce, flattenByCountry} from "@/utils/public.ts";
import type {RootState} from "@/store";
import {
    setCabinValue,
    setDaValue, setErrorMsg,
    setLocalDate,
    setRadioType, setSearchFlag,
    setSearchLoad,
    setTravelers
} from "@/store/searchInfo.ts";


const cabinOptions = [
    { label: 'Economy Class', value: 'y' },
    { label: 'Business Class', value: 'c' },
    { label: 'First Class', value: 'f' },
];


const AddressCard = memo(({style,address}:{style?:React.CSSProperties,address:IAirport}) => {
    return (
        <div className={`${styles.addressCard} cursor-p`} style={style}>
            {
                !!address &&  <div>
                    <span>{address.cityEName}</span>
                    <p>{address.airportEName}</p>
                </div>
            }
        </div>
    )
})

const InputModel = memo(({children,openPop,style}:{
    children:React.ReactNode,
    openPop?:(current:React.MouseEvent<HTMLDivElement>) => void;
    style?:React.CSSProperties;
}) => {

    const clickPop = useCallback((event:React.MouseEvent<HTMLDivElement>) => {
        if(openPop){
            openPop(event)
        }
    },[])

    return (
        <div className={`${styles.inputModel} cursor-p s-flex ai-ct jc-bt`} style={style} onClick={clickPop}>
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
    <>
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
    </>
))

const Airports = () => {
    const daValue = useSelector((state: RootState) => state.searchInfo.daValue)

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
            ...daValue,
            [types]:airport
        }))
        closePop()
    }

    const [searchList, setSearchList] = useState<FilterAirport[]>([])

    const searchCity = debounce((value: string) => {
        fuzzyQueryGlobalAirportsAgent(value).then(res => {
            setSearchList(flattenByCountry(res))
        })
    }, 300)


    return (
        <div className={`s-flex s-flex ai-ct`}>
            <InputModel openPop={(event) => openPop(event,'departure')}>
                {
                    !!daValue.departure && <AddressCard address={daValue.departure} />
                }
            </InputModel>
            <div className={`${styles.cycleAddress} s-flex ai-ct jc-ct cursor-p`} onClick={() =>  dispatch(setDaValue({
                departure:daValue.arrival || null,
                arrival:daValue.departure || null
            }))}>
                <ConnectingAirportsIcon />
            </div>
            <InputModel openPop={(event) => openPop(event,'arrival')}>
                {
                    !!daValue.arrival && <AddressCard style={{marginLeft: '4px'}} address={daValue.arrival} />
                }
            </InputModel>
            <InputPop id='searchInputPop' open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.popBox}>
                    <div className={styles.popBoxSearch}>
                        <InputModel style={{width: '100%'}}>
                            <input type="text" ref={inputRef} onChange={(e) => searchCity(e.currentTarget.value)}
                                   className={`${styles.inputBox} flex-1`}/>
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
                            searchList.map((region) => {
                                return (
                                    <div key={region.countryCode}>
                                        <div className={styles.addressArea}>
                                            <span>{region.countryEName}</span>
                                        </div>
                                        <div className={styles.addressBox}>
                                            <Grid container spacing={2}>
                                                {
                                                    region.airports.map(airport => (
                                                        <Grid key={airport.airportCode}>
                                                            <div
                                                                onClick={() => handleInput(airport)}
                                                                className={`${styles.addressItem} s-flex flex-dir ai-fs jc-ct cursor-p`}>
                                                                <span>{airport.cityEName}</span>
                                                                <span>{airport.airportEName}</span>
                                                            </div>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </InputPop>
        </div>
    )
}

const TimerChoose = memo(({isRound}:{
    isRound: boolean
}) => {
    const localDate = useSelector((state: RootState) => state.searchInfo.localDate)

    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)

    const openPop = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }, [isRound])

    const closePop = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setAnchorEl(null)
    }, [localDate])




    const handleSelect = (val: DateRange | Date | undefined) => {
        if (!val) return
        if(isRound){
            const {to,from} = val as DateRange
            dispatch(setLocalDate({
                to:dayjs(to).format('YYYY-MM-DD'),
                from:dayjs(from).format('YYYY-MM-DD')
            }))
        }else{
            dispatch(setLocalDate(dayjs(val as Date).format('YYYY-MM-DD')))
        }
    }

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
                    {formatRange}
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
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={2}
                                fixedWeeks
                            />
                        ) : (
                            <DayPicker
                                mode="single"
                                selected={new Date(localDate as string)}
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={1}
                                fixedWeeks
                            />
                        )
                    }
                    <div className={`s-flex jc-fe`}>
                        <Button onClick={closePop} variant="contained" sx={{
                            backgroundColor: 'var(--back-color)',
                        }}>Choose</Button>
                    </div>
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


    const closePop = useCallback(() => {
        // 移除焦点（失焦）
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
    },[])

    const countAll = useMemo(() => {
        return travelers.reduce((sum, t) => sum + t.passengerCount, 0)
    }, [travelers]);

    const PersonChild = memo(() => (
        <div className={`${styles.inputMessage} s-flex jc-ct ai-ct`}>
            <PersonIcon sx={{fontSize: 24}} />
            <p>{countAll} Passengers , Economy</p>
        </div>
    ))

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
    const localDate = useSelector((state: RootState) => state.searchInfo.localDate)
    const cabinValue = useSelector((state: RootState) => state.searchInfo.cabinValue)
    const travelers = useSelector((state: RootState) => state.searchInfo.travelers)
    const daValue = useSelector((state: RootState) => state.searchInfo.daValue)
    const searchLoad = useSelector((state: RootState) => state.searchInfo.searchLoad)

    const isRound = useMemo(() => radioType === 'round', [radioType])


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

        const newDeparture = newItem.itineraries[0].departure.airportCode;
        const newArrival = newItem.itineraries[0].arrival.airportCode;

        // 去重：如果已有同样出发地 + 到达地 的记录，先移除旧的
        history = history.filter(item => {
            const oldDeparture = item.itineraries[0].departure.airportCode;
            const oldArrival = item.itineraries[0].arrival.airportCode;
            return !(oldDeparture === newDeparture && oldArrival === newArrival);
        });

        // 插入新项到最前
        history.unshift(newItem);

        // 限制最多 3 项
        if (history.length > 3) {
            history = history.slice(0, 3);
        }

        localStorage.setItem(key, JSON.stringify(history));
    }




    const search = () => {
        if(searchLoad) return
        dispatch(setSearchLoad(true))
        dispatch(setSearchFlag(true))

        const result: FQuery = {
            itineraryType: radioType,
            cabinLevel: cabinValue,
            travelers,
            itineraries: [],
        }


        if (radioType === 'oneWay') {
            result.itineraries = [
                {
                    itineraryNo: 0,
                    arrival: daValue.arrival?.airportCode as string,
                    departure: daValue.departure?.airportCode as string,
                    departureDate: dayjs(new Date(localDate as string)).format('YYYY-MM-DD'),
                },
            ]
        } else if (radioType === 'round') {
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
        }

        dispatch(setQuery(result))

        const newQuery = {...result}
        newQuery.travelers = result.travelers.filter(traveler => traveler.passengerCount>0)

        getAuthorizableRoutingGroupAgent(newQuery).then(res => {
            if(res.length){
                setHistorySearch({
                    ...newQuery,
                    itineraries:newQuery.itineraries.map(it => ({...it,departure:daValue.departure as IAirport,
                        arrival:daValue.arrival as IAirport}))
                })

                const objResult = deduplicateByChannelCode(res)
                dispatch(setSearchDate(objResult))
                const allFailed = objResult.every(a => a.succeed !== true)
                dispatch(setSearchLoad(false))

                if(allFailed){
                    dispatch(setSearchDate([]))
                    dispatch(setErrorMsg('No suitable data'))
                }
            }else{
                dispatch(setSearchLoad(false))
                dispatch(setErrorMsg('No suitable data'))
            }

        }).catch(() => {
            dispatch(setSearchLoad(false))
            dispatch(setErrorMsg('Interface error'))
        })
    }



    return (
        <div className={styles.searchContainer}>
            <div>
                <RadioGroup row value={radioType} onChange={
                    (event) => dispatch(setRadioType(event.target.value as ItineraryType))
                } name="row-radio-buttons-group">
                    <FormControlLabel label="Round-trip" control={<Radio/>} value={'round'}></FormControlLabel>
                    <FormControlLabel label="One-way" control={<Radio/>} value={'oneWay'}></FormControlLabel>
                    <FormControlLabel label="Multi-city" disabled control={<Radio/>} value={'multi'}></FormControlLabel>
                </RadioGroup>
            </div>
            <div className={`s-flex ai-ct jc-bt`}>
                <Airports />
                <TimerChoose isRound={isRound} />
                <PersonChoose />
                <Button variant="contained" onClick={search} loading={searchLoad} sx={{
                    width: '120px',
                    height: '54px',
                    color: 'white',
                    fontSize: '1.4rem',
                    backgroundColor: 'var(--active-color)',
                }} startIcon={<SearchIcon sx={{width: '2.4rem',height: '2.4rem'}} />}>
                    Search
                </Button>
            </div>

        </div>
    );
}

export default SearchComponent;
