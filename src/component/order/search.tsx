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
import {memo, useCallback, useMemo, useState} from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import * as React from "react";
import {format, parseISO} from 'date-fns';


import {DayPicker, type DateRange} from "react-day-picker";
import "react-day-picker/style.css";

import type {ItineraryType, PassengerType} from "@/types/order.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {
    setTravelers,
    updateItineraries,
    setAirportList,
    setQueryType
} from "@/store/orderInfo.ts";
import {getAuthorizableRoutingGroupAgent} from "@/utils/request/agetn.ts";



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
    { label: 'Economy', value: 'economy' },
    { label: 'Economy/Premium Economy', value: 'economy_premium' },
    { label: 'Premium Economy', value: 'premium_economy' },
    { label: 'Business', value: 'business' },
    { label: 'First/Business', value: 'first_business' },
    { label: 'First', value: 'first' },
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

const Airports = memo(() => {
    const query = useSelector((state: RootState) => state.ordersInfo.query)

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

    return (
        <div className={`s-flex s-flex ai-ct`}>
            <InputModel openPop={(event) => openPop(event,query.itineraries[0].departure)}>
                <AddressCard addressName={query.itineraries[0].departure} />
            </InputModel>
            <div className={`${styles.cycleAddress} s-flex ai-ct jc-ct cursor-p`}>
                <ConnectingAirportsIcon />
            </div>
            <InputModel openPop={(event) => openPop(event,query.itineraries[0].arrival)}>
                <AddressCard style={{marginLeft: '4px'}} addressName={query.itineraries[0].arrival} />
            </InputModel>
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

const TimerChoose = memo(() => {
    const dispatch = useDispatch()
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const isRound = useMemo(() => query.itineraryType === 'round', [query.itineraryType])

    const selectedSingle = useMemo(() => {
        const dateStr = query.itineraries[0]?.departureDate
        return dateStr ? new Date(dateStr) : undefined
    }, [query.itineraries])

    const selectedRange: DateRange | undefined = useMemo(() => {
        const from = query.itineraries[0]?.departureDate
        const to = query.itineraries[1]?.departureDate
        if (isRound && from && to) {
            return {
                from: new Date(from),
                to: new Date(to),
            }
        }
        return undefined
    }, [isRound, query.itineraries])

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

        if (isRound) {
            const range = val as DateRange
            if (range.from && range.to) {
                dispatch(updateItineraries([
                    format(range.from, 'yyyy-MM-dd'),
                    format(range.to, 'yyyy-MM-dd'),
                ]))
            }
        } else {
            const date = val as Date
            dispatch(updateItineraries([
                format(date, 'yyyy-MM-dd'),
                '',
            ]))
        }
    }

    const formatRange = useMemo(() => {
        const first = query.itineraries[0]?.departureDate
        if (!first) return null

        if (!isRound) {
            return <p>{format(parseISO(first), 'EEE, MMM dd')}</p>
        } else {
            const second = query.itineraries[1]?.departureDate
            return (
                <>
                    <p>{format(parseISO(first), 'EEE, MMM dd')}</p>
                    <p>-</p>
                    <p>{second ? format(parseISO(second), 'EEE, MMM dd') : ''}</p>
                </>
            )
        }
    }, [isRound, query.itineraries])

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
                                selected={selectedRange}
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={2}
                                fixedWeeks
                            />
                        ) : (
                            <DayPicker
                                mode="single"
                                selected={selectedSingle}
                                onSelect={handleSelect}
                                disabled={{ before: new Date() }}
                                numberOfMonths={1}
                                fixedWeeks
                            />
                        )
                    }
                    <div className="s-flex jc-fe">
                        <Button variant="contained" onClick={closePop}>Confirm Date</Button>
                    </div>
                </div>
            </InputPop>
        </>
    )
})

const PersonChoose = memo(() => {
    const dispatch = useDispatch()
    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const popId = useMemo(() => anchorEl? 'timer-choose-pop': undefined,[anchorEl])
    const openPop = useCallback((event:React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    },[])

    const [cabinValue] = useState<string>('economy')

    const closePop = useCallback(() => {
        // 移除焦点（失焦）
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
    },[])

    const countAll = useMemo(() => {
        return query.travelers.reduce((sum, t) => sum + t.passengerCount, 0)
    }, [query.travelers]);

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
            return query.travelers.find(a => a.passengerType === value)
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
                                query.travelers.map(traveler => {
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
                            <Select labelId='Cabin' size='small' value={cabinValue} id='Cabin' sx={{ width: '100%' }}>
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
    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const search = () => {
        const newQuery = {...query}
        newQuery.travelers = query.travelers.filter(traveler => traveler.passengerCount>0)

        getAuthorizableRoutingGroupAgent(newQuery).then(res => {
            if(res.length){
                dispatch(setAirportList(res))
            }
        })
    }


    return (
        <div className={styles.searchContainer}>
            <div>
                <RadioGroup row value={query.itineraryType} onChange={
                    (event) => dispatch(setQueryType(event.target.value as ItineraryType))
                } name="row-radio-buttons-group">
                    <FormControlLabel label="Round-trip" control={<Radio/>} value={'round'}></FormControlLabel>
                    <FormControlLabel label="One-way" control={<Radio/>} value={'oneWay'}></FormControlLabel>
                    <FormControlLabel label="Multi-city" control={<Radio/>} value={'multi'}></FormControlLabel>
                </RadioGroup>
            </div>
            <div className={`s-flex ai-ct jc-bt`}>
                <Airports />
                <TimerChoose />
                <PersonChoose />
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
