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
import { DateRange } from 'react-date-range';
import SearchIcon from '@mui/icons-material/Search';
import type {ITicketType} from "@/types/order.ts";
import * as React from "react";
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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

const AddressCard = memo(({style}:{style?:React.CSSProperties}) => {
    return (
        <div className={`${styles.addressCard} cursor-p`} style={style}>
            <div>
                <span>Beijing</span>
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
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement|null>(null)
    const open = useMemo(() => Boolean(anchorEl),[anchorEl])
    const popId = useMemo(() => open ? 'airportId':undefined ,[open])
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

    return (
        <div className={`s-flex s-flex ai-ct`}>
            <InputModel openPop={openPop}>
                <AddressCard  />
            </InputModel>
            <div className={`${styles.cycleAddress} s-flex ai-ct jc-ct cursor-p`}>
                <ConnectingAirportsIcon />
            </div>
            <InputModel openPop={openPop}>
                <AddressCard style={{marginLeft: '4px'}} />
            </InputModel>
            <InputPop id={popId} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                <div className={styles.popBox}>
                    <div className={styles.popBoxSearch}>
                        <InputModel style={{width: '100%',}}>
                            <AddressCard  />
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

interface IDate {
    startDate: Date;
    endDate: Date;
    key: 'selection';
}
const TimerChoose = memo(() => {
    const [dateValue, setDateValue] = useState<IDate[]>([{
        startDate: new Date(),
        endDate: (() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        })(),
        key: 'selection',
    },])

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

    const formatRange = useMemo(() => {
        const formattedStart = format(dateValue[0].startDate, 'EEE,MMM dd'); // Thu,May 22
        const formattedEnd = format(dateValue[0].endDate, 'EEE,MMM dd');     // Thu,Jun 19
        return (
            <>
                <p>{formattedStart}</p>
                <p>-</p>
                <p>{formattedEnd}</p>
            </>
        )
    },[dateValue])

    const changeDate = (selection:IDate) => {
        const { startDate, endDate } = selection;
        if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
            closePop();
        }
        setDateValue([selection])
    }

    return (
        <>
            <InputModel openPop={openPop}>
                <div className={`${styles.inputMessage} s-flex jc-ad flex-row ai-ct full-width`}>
                    {formatRange}
                </div>
            </InputModel>
            <InputPop id={popId} open={open} anchorEl={anchorEl as HTMLDivElement} closePop={closePop}>
                {
                    <div className={styles.dateClass}>
                        <DateRange
                            locale={enUS}
                            onChange={({selection}) => changeDate(selection as IDate)}
                            moveRangeOnFirstSelection={false}
                            ranges={dateValue}
                            months={2}
                            direction="horizontal"
                        />
                    </div>
                }
            </InputPop>
        </>

    )
})

const PersonChoose = memo(() => {
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

    const PersonChild = memo(() => (
        <div className={`${styles.inputMessage} s-flex jc-ct ai-ct`}>
            <PersonIcon sx={{fontSize: 24}} />
            <p>8 Passengers , Economy</p>
        </div>
    ))

    const Counter = memo(() => {
        const [count, setCount] = useState(4);

        return (
            <Stack direction="row" spacing={2} alignItems="center">
                <IconButton color="primary" disabled={!count && true} onClick={() => setCount(prev => Math.max(0, prev - 1))}>
                    <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{count}</Typography>
                <IconButton color="primary" onClick={() => setCount(prev => prev + 1)}>
                    <AddIcon />
                </IconButton>
            </Stack>
        );
    })

    const PersonCheck = memo(({title,tips}:{
        title:string;
        tips:string;
    }) => (
        <div className={`${styles.personCheck} s-flex ai-ct jc-bt`}>
            <div className={styles.checkLabel}>
                <span>{title}</span>
                <p>{tips}</p>
            </div>
            <Counter />
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
                            <PersonCheck title='Adults' tips='12+ years old' />
                            <PersonCheck title='Children' tips='2–11 years old' />
                            <PersonCheck title='Infants on lap' tips='Under 2 years old' />
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
    const [ticketType] = useState<ITicketType>('roundTrip')
    return (
        <div className={styles.searchContainer}>
            <div>
                <RadioGroup row value={ticketType} name="row-radio-buttons-group">
                    <FormControlLabel label="Round-trip" control={<Radio/>} value={'roundTrip'}></FormControlLabel>
                    <FormControlLabel label="One-way" control={<Radio/>} value={'oneWay'}></FormControlLabel>
                    <FormControlLabel label="Multi-city" control={<Radio/>} value={'multiCity'}></FormControlLabel>
                </RadioGroup>
            </div>
            <div className={`s-flex ai-ct jc-bt`}>
                <Airports />
                <TimerChoose />
                <PersonChoose />

                <Button variant="contained" sx={{
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
