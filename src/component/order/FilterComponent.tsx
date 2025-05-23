import {Box, Checkbox, Divider, FormControlLabel, FormGroup, Slider, SliderThumb, Typography} from "@mui/material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LuggageIcon from '@mui/icons-material/Luggage';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import styles from './styles.module.less'
import {memo, useState} from "react";
import * as React from "react";


const recommendedArr = [
    {
        icon: <FlightTakeoffIcon/>,
        label: 'Nonstop',
        value: 'nonstop'
    },
    {
        icon: <LuggageIcon/>,
        label: 'Baggage',
        value: 'baggage'
    },
    {
        icon: <BusinessCenterIcon/>,
        label: 'Work',
        value: 'work'
    },
    {
        icon: <LocalAirportIcon/>,
        label: 'Airport',
        value: 'airport'
    },
    {
        icon: <div>CO2e</div>,
        label: 'Low Emissions',
        value: 'co2'
    }
]


type AirbnbThumbComponentProps = React.HTMLAttributes<HTMLSpanElement> & {
    ownerState: {
        value: number[];
    };
};

export function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
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
}

const FilterAccordion = memo(({title, render}: {
    title: string;
    render: React.ReactNode;
}) => {
    const [open, setOpen] = useState(true)
    return (
        <div className={styles.filterAccordion}>
            <div className={`${styles.filterHeader} s-flex jc-bt ai-ct cursor-p`} onClick={() => setOpen(!open)}>
                <div className={styles.filterTitle}>
                    <span>{title}</span>
                </div>
                <div className={`s-flex ai-ct cursor-p`}>
                    <Box
                        onClick={() => console.log('clicked')}
                        sx={{
                            cursor: 'pointer', color: 'var(--active-color)', '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        Clear
                    </Box>
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

// --- 新增组件: 推荐项复用 ---
const RecommendedCheckboxList = () => (
    <FormGroup>
        {recommendedArr.map((item) => (
            <FormControlLabel
                key={item.value}
                control={
                    <Checkbox
                        defaultChecked
                        value={item.value}
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
                        <div className={`${styles.icons} s-flex ai-ct`}>{item.icon}</div>
                        <span>{item.label}</span>
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
);

// --- 新增组件: 时间滑块复用 ---
const TimeRangeSlider = ({label,value,setValue,maxStart = 24,minEnd = 0}: {
    label: string;
    value: number[];
    setValue: (v: number[]) => void;
    maxStart?: number;
    minEnd?: number;
}) => {
    const formatTime = (v: number) => String(v).padStart(2, '0') + ':00';

    return (
        <Box sx={{width: '100%', mx: 'auto'}}>
            <Typography gutterBottom className={`${styles.timerTitle} s-flex ai-ct`}>
                <span>{label}</span>
                <span>
                    {formatTime(value[0])} – {formatTime(value[1])}
                </span>
            </Typography>
            <Slider
                value={value}
                onChange={(_, newValue) => {
                    let [start, end] = newValue as number[];
                    start = Math.min(start, maxStart);
                    end = Math.max(end, minEnd);
                    if (start > end) start = end;
                    setValue([start, end]);
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
};

const FilterComponent = memo(() => {
    const [statrtValue, setStatrtValue] = useState([0, 24]);
    const [endValue, setEndValue] = useState([0, 24]);

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterbox}>
                <div className={`${styles.titleBox} s-flex ai-ct jc-bt`}>
                    <div className={styles.title}>
                        <span>Filters (Departure)</span>
                        <p>43 flights found</p>
                    </div>
                    <Box
                        onClick={() => console.log('clicked')}
                        sx={{
                            cursor: 'pointer',
                            color: 'var(--active-color)',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Clear All
                    </Box>
                </div>
                <div className={`${styles.filterLiBox} s-flex flex-wrap`}>
                    <div className={`${styles.fliterLi} s-flex ai-st cursor-p`}>
                        <div className={styles.label}>
                            <span>Carry-on baggage included</span>
                        </div>
                        <CloseIcon/>
                    </div>
                    <div className={`${styles.fliterLi} s-flex ai-st cursor-p`}>
                        <div className={styles.label}>
                            <span>Nonstop</span>
                        </div>
                        <CloseIcon/>
                    </div>
                    <div className={`${styles.fliterLi} s-flex ai-st cursor-p`}>
                        <div className={styles.label}>
                            <span>All Airlines</span>
                        </div>
                        <CloseIcon/>
                    </div>
                    <div className={`${styles.fliterLi} s-flex ai-st cursor-p`}>
                        <div className={styles.label}>
                            <span>Departing from BeijingBeijing: </span>
                            <span>05:00 – 24:00 </span>
                        </div>
                        <CloseIcon/>
                    </div>
                </div>
            </div>
            <Divider component="div"/>
            <FilterAccordion title="Departure" render={<RecommendedCheckboxList/>}/>
            <Divider component="div"/>
            <FilterAccordion title="Arrival" render={<RecommendedCheckboxList/>}/>
            <Divider component="div"/>
            <FilterAccordion
                title="Timers"
                render={
                    <>
                        <TimeRangeSlider
                            label="Departing from Beijing:"
                            value={statrtValue}
                            setValue={setStatrtValue}
                            maxStart={18}
                        />
                        <TimeRangeSlider
                            label="Departing from Shanghai:"
                            value={endValue}
                            setValue={setEndValue}
                            minEnd={6}
                        />
                    </>
                }
            />
            <FilterAccordion title="Airports" render={<></>}/>
        </div>
    );
})

export default FilterComponent;
