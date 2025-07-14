import {
    Button,
    Divider, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Popover,
    Radio,
    RadioGroup, Select, Stack, TextField,
    Typography
} from '@mui/material';
import styles from './styles.module.less'
import {type ChangeEvent, memo, useCallback, useEffect, useMemo, useState} from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import * as React from "react";
import {format} from 'date-fns';


import {DayPicker, type DateRange} from "react-day-picker";
import "react-day-picker/style.css";

import type {CabinLevel, FQuery, ItineraryType, PassengerType, Travelers} from "@/types/order.ts";
import {useDispatch} from "react-redux";
import {
    setQuery, setSearchDate
} from "@/store/orderInfo.ts";
import {getAuthorizableRoutingGroupAgent} from "@/utils/request/agetn.ts";
import dayjs from "dayjs";
import {deduplicateByChannelCode} from "@/utils/order.ts";
import {airJSON} from "@/air.ts";

interface IdaValue{
    arrival: string
    departure:string
}

const regions = [
    {
        title: 'Asia',
        cities: ['Shanghai', 'Beijing', 'Chengdu', 'Guangzhou', 'Urumqi', 'Shenzhen'],
    },
    {
        title: 'Europe',
        cities: ['London', 'Paris', 'Rome', 'Milan', 'Barcelona', 'Madrid'],
    },
    {
        title: 'North America',
        cities: ['Los Angeles', 'New York', 'San Francisco', 'Boston', 'Toronto', 'Vancouver'],
    },
    {
        title: 'South America',
        cities: ['Sao Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Santiago', 'Lima', 'Bogota'],
    },
    {
        title: 'Africa',
        cities: ['Cairo', 'Nairobi', 'Casablanca', 'Dar es salaam', 'Johannesburg', 'Mauritius'],
    },
    {
        title: 'Oceania',
        cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Auckland', 'Christchurch'],
    },
];

const cabinOptions = [
    { label: 'Economy Class', value: 'y' },
    { label: 'Business Class', value: 'c' },
    { label: 'First Class', value: 'f' },
];

const AddressCard = memo(({style,addressName}:{style?:React.CSSProperties,addressName:string}) => {
    return (
        <div className={`${styles.addressCard} cursor-p`} style={style}>
            <div>
                <span>{addressName}</span>
                <p>All airports</p>
            </div>
            <CancelIcon className='cursor-p' />
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

const Airports = memo(({daValue,changeValue}:{
    daValue: IdaValue
    changeValue:(type:'departure'|'arrival'|'journey',value:string|IdaValue) => void;
}) => {

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const popId = useMemo(() => open ? 'airportId':undefined ,[open])
    const [addressChoose, setAddressChoose] = useState('')
    const openPop = useCallback((event:React.MouseEvent<HTMLDivElement>,name:string) => {
        setAddressChoose(name)
        setAnchorEl(event.currentTarget)
    },[])

    const closePop = useCallback(() => {
        // 移除焦点（失焦）
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
    },[])

    const handleInput = (e: ChangeEvent<HTMLInputElement>,type:'departure'|'arrival') => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
        e.target.value = value
        changeValue(type,value)
    }

    const changeJourney = () => {
        changeValue('journey', {
            departure:daValue.arrival,
            arrival:daValue.departure
        })
    }

    return (
        <div className={`s-flex s-flex ai-ct`}>
            {/*<InputModel openPop={(event) => openPop(event,query.itineraries[0].departure)}>*/}
            {/*    <AddressCard addressName={query.itineraries[0].departure} />*/}
            {/*</InputModel>*/}
            <TextField variant="outlined" value={daValue.departure} sx={{
                width: 'var(--put-width)',
                height: 'var(--put-height)',
                '& .MuiOutlinedInput-root': {
                    height: '100%',       // 确保 input 区域也匹配 height
                    '& fieldset': {
                        borderColor: 'var(--put-border-color)',
                        borderRadius: 'var(--put-border-raduis)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--put-border-color)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--put-border-color)',
                    },
                },
            }} onInput={(e:ChangeEvent<HTMLInputElement>) => handleInput(e,'departure')} />
            <div className={`${styles.cycleAddress} s-flex ai-ct jc-ct cursor-p`} onClick={changeJourney}>
                <ConnectingAirportsIcon />
            </div>
            <TextField variant="outlined" value={daValue.arrival}  sx={{
                width: 'var(--put-width)',
                height: 'var(--put-height)',
                '& .MuiOutlinedInput-root': {
                    height: '100%',       // 确保 input 区域也匹配 height
                    '& fieldset': {
                        borderColor: 'var(--put-border-color)',
                        borderRadius: 'var(--put-border-raduis)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--put-border-color)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--put-border-color)',
                    },
                },
            }} onInput={(e:ChangeEvent<HTMLInputElement>) => handleInput(e,'arrival')} />

            {/*<InputModel openPop={(event) => openPop(event,query.itineraries[0].arrival)}>*/}
            {/*    <AddressCard style={{marginLeft: '4px'}} addressName={query.itineraries[0].arrival} />*/}
            {/*</InputModel>*/}
            <InputPop id={popId} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.popBox}>
                    <div className={styles.popBoxSearch}>
                        <InputModel style={{width: '100%',}}>
                            <AddressCard  addressName={addressChoose} />
                            <input type="text" className={styles.inputBox}/>
                        </InputModel>
                    </div>
                    <Divider />
                    <div className={styles.popScroll}>
                        <div className={styles.currentAddress}>
                            <div className={styles.currentAddressTitle}>
                                <span>Current Location / Recent Searches</span>
                            </div>
                            <div className={styles.addressBox}>
                                <Grid container spacing={2}>
                                    <Grid size={4}>
                                        <div className={`${styles.addressItem} s-flex ai-ct jc-ct cursor-p`}>
                                            <AddLocationIcon />
                                            <span>Beijing</span>
                                        </div>
                                    </Grid>

                                </Grid>
                            </div>
                        </div>
                        <Divider />
                        {
                            regions.map((region) => {
                                return (
                                    <div key={region.title}>
                                        <div className={styles.addressArea}>
                                            <span>{region.title}</span>
                                        </div>
                                        <div className={styles.addressBox}>
                                            <Grid container spacing={2}>
                                                {
                                                    region.cities.map(citie => (
                                                        <Grid size={4} key={citie}>
                                                            <div className={`${styles.addressItem} s-flex ai-ct jc-ct cursor-p`}>
                                                                <span>{citie}</span>
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
})

const TimerChoose = memo(({localDate,isRound,setLocalDate}:{
    localDate: DateRange | Date | undefined
    isRound: boolean
    setLocalDate: (date:DateRange | Date) => void
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)
    const popId = open ? 'timer-choose-pop' : undefined
    const openPop = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }, [])
    const closePop = useCallback(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }
        setAnchorEl(null)
    }, [])




    const handleSelect = (val: DateRange | Date | undefined) => {
        if (!val) return
        setLocalDate(val)
    }

    const formatRange = useMemo(() => {
        if(!isRound){
            if(localDate instanceof Date) return <p>{localDate && format(localDate as Date, 'EEE, MMM dd')}</p>
        }else{
            const {from,to} = localDate as DateRange
            return (
                <>
                    <p>{from && format(from!, 'EEE, MMM dd')}</p>
                    <p>-</p>
                    <p>{to && format(to!, 'EEE, MMM dd')}</p>
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
            <InputPop id={popId} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.dateClass}>
                    {
                        isRound ? (
                            <DayPicker
                                mode="range"
                                selected={localDate as DateRange}
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={2}
                                fixedWeeks
                            />
                        ) : (
                            <DayPicker
                                mode="single"
                                selected={localDate as Date}
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={1}
                                fixedWeeks
                            />
                        )
                    }
                </div>
            </InputPop>
        </>
    )
})

const PersonChoose = memo(({travelers,setTravelers,cabinValue,setCabinValue}:{
    travelers: Travelers[]
    setTravelers: (traveler: Travelers) => void
    cabinValue: CabinLevel
    setCabinValue:(val:CabinLevel) => void
}) => {

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const popId = useMemo(() => anchorEl? 'timer-choose-pop': undefined,[anchorEl])
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
            setTravelers({
                ...traveler,
                passengerCount: count,
            })
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
            <InputPop id={popId} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
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
                            <Select labelId='Cabin' size='small' value={cabinValue} onChange={(event) => setCabinValue(event.target.value)} id='Cabin' sx={{ width: '100%' }}>
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
})

const SearchComponent = memo(() => {
    const dispatch = useDispatch()
    const [daValue, setDaValue] = useState<IdaValue>({
        departure:'',
        arrival:''
    })
    const [radioType, setRadioType] = useState<ItineraryType>('oneWay')
    const isRound = useMemo(() => radioType === 'round', [radioType])
    const lcaolDateValue = useMemo(() => {
        if (isRound) {
            const from = dayjs().format('YYYY-MM-DD')
            const to = dayjs().add(1,'day').format('YYYY-MM-DD')
            return from && to ? { from: new Date(from), to: new Date(to) } : undefined
        } else {
            const date = dayjs().format('YYYY-MM-DD')
            return date ? new Date(date) : undefined
        }
    },[isRound])
    const [localDate, setLocalDate] = useState<DateRange | Date | undefined>(lcaolDateValue)
    const [travelers, setTravelers] = useState<Travelers[]>([
        { passengerCount: 1, passengerType: 'adt' },
        { passengerCount: 0, passengerType: 'chd' },
        { passengerCount: 0, passengerType: 'inf' },
    ])
    const [cabinValue, setCabinValue] = useState<CabinLevel>('y')


    useEffect(() => {
        setLocalDate(lcaolDateValue)
    },[isRound])


    const handleSetLocalDate = useCallback((val:DateRange | Date) => {
        setLocalDate(val)
    }, [localDate]);

    const handleChangeValue = useCallback((type:'departure'|'arrival'|'journey',value:string|IdaValue) => {
        if(type === 'journey'){
            setDaValue(value as IdaValue)
            return
        }
        setDaValue(prevState => {
            return {
                ...prevState,
                [type]:value
            }
        })
    }, [daValue]);

    const handleSetTravelers = useCallback((traveler:Travelers) => {
        setTravelers(prevState => {
            const { passengerType, passengerCount } = traveler
            const index = prevState.findIndex(t => t.passengerType === passengerType)

            if (index === -1) return prevState // 没找到，不变

            const newTravelers = [...prevState]
            newTravelers[index] = {
                ...newTravelers[index],
                passengerCount, // 更新 count
            }

            return newTravelers
        })

    }, [travelers]);
    const handleSetCabinValue = useCallback((val:CabinLevel) => {
        setCabinValue(val)
    },[cabinValue])



    const search = () => {
        const results = deduplicateByChannelCode(airJSON)
        dispatch(setSearchDate(results))
        return
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
                    arrival: daValue.arrival,
                    departure: daValue.departure,
                    departureDate: dayjs(localDate as Date).format('YYYY-MM-DD'),
                },
            ]
        } else if (radioType === 'round') {
            const { from, to } = localDate as DateRange
            result.itineraries = [
                {
                    itineraryNo: 0,
                    arrival: daValue.arrival,
                    departure: daValue.departure,
                    departureDate: dayjs(from).format('YYYY-MM-DD'),
                },
                {
                    itineraryNo: 1,
                    arrival: daValue.departure,
                    departure: daValue.arrival,
                    departureDate: dayjs(to).format('YYYY-MM-DD'),
                },
            ]
        }

        dispatch(setQuery(result))

        const newQuery = {...result}
        newQuery.travelers = result.travelers.filter(traveler => traveler.passengerCount>0)



        getAuthorizableRoutingGroupAgent(newQuery).then(res => {
            if(res.length){
                const result = deduplicateByChannelCode(res)

                dispatch(setSearchDate(result))
            }
        })
    }


    return (
        <div className={styles.searchContainer}>
            <div>
                <RadioGroup row value={radioType} onChange={
                    (event) => setRadioType(event.target.value as ItineraryType)
                } name="row-radio-buttons-group">
                    <FormControlLabel label="Round-trip" control={<Radio/>} value={'round'}></FormControlLabel>
                    <FormControlLabel label="One-way" control={<Radio/>} value={'oneWay'}></FormControlLabel>
                    <FormControlLabel label="Multi-city" disabled control={<Radio/>} value={'multi'}></FormControlLabel>
                </RadioGroup>
            </div>
            <div className={`s-flex ai-ct jc-bt`}>
                <Airports daValue={daValue} changeValue={handleChangeValue} />
                <TimerChoose localDate={localDate} isRound={isRound} setLocalDate={handleSetLocalDate} />
                <PersonChoose travelers={travelers} setTravelers={handleSetTravelers} cabinValue={cabinValue} setCabinValue={handleSetCabinValue} />
                <Button variant="contained" onClick={search} sx={{
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
})

export default SearchComponent;
