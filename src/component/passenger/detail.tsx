import {memo, useCallback, useState} from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import styles from './styles.module.less'
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip, createTheme,
    Divider,
    FilledInput, FormControl, Grid,
    InputLabel, ListSubheader, MenuItem, Select,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WifiIcon from "@mui/icons-material/Wifi";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import HtmlTooltip from "@/component/defult/Tooltip.tsx";
import AirTooltip from "@/component/defult/AirTooltip.tsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';

import T from '@/assets/t.png'
import C from '@/assets/c.png'
import Passenger from "@/component/passenger/passenger.tsx";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const FirportInfomation = memo(() => {
    return (
        <div className={styles.firportInfomation}>
            <div className={`${styles.firportDate} s-flex ai-ct`}>
                <Chip label="Depart" size={'small'} sx={{
                    background: 'var(--active-color)',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    color: 'var(--vt-c-white)',
                    fontWeight: 'bold',
                    '.MuiChip-label':{
                        fontSize: '1.2em',
                    }
                }} />
                <div className={`${styles.firportDateLabel} s-flex ai-ct`}>
                    <span>Wed, May 21</span>
                    <Divider orientation="vertical" sx={{
                        height: 10
                    }} flexItem />
                    <span>Duration 2h 10m</span>
                </div>
            </div>
            <div className={styles.infoNew}>
                <div className={`${styles.infoNewList} s-flex ai-ct`}>
                    <div className={styles.infoLabel}>16:30</div>
                    <div className={styles.infoValue}>
                        <strong>PKX</strong> Beijing Daxing Intl.
                    </div>
                </div>
                <div className={`${styles.firportDetails} s-flex ai-ct`}>
                    <div className={`${styles.infoLabel} s-flex jc-ct`}>
                        <div className={styles.firPicture}>
                            <img src="https://static.tripcdn.com/packages/flight/airline-logo/latest/airline_logo/3x/fm.webp" alt=""/>
                        </div>
                    </div>
                    <div className={`${styles.firTips} s-flex ai-ct`}>
                        <div className={`${styles.tipsLabel} s-flex ai-ct`}>
                            Shanghai Airlines
                            FM9102
                            Boeing 738
                            Economy
                        </div>
                        <HtmlTooltip title={
                            <AirTooltip />
                        }>
                            <div className={`${styles.airIcon} s-flex ai-ct`}>
                                <BoltIcon />
                                <RestaurantIcon />
                                <WifiIcon />
                                <PlayCircleIcon />
                            </div>
                        </HtmlTooltip>
                    </div>
                </div>
                <div className={`${styles.infoNewList} s-flex ai-ct`}>
                    <div className={styles.infoLabel}>18:40</div>
                    <div className={styles.infoValue}>
                        SHA Shanghai Hongqiao Intl.T2
                    </div>
                </div>
            </div>
        </div>
    )
})

const CardCom = memo(() => {

    const [chipHide, setChipHide] = useState(false)
    const [priceHide, setPriceHide] = useState(false)

    const setChip = () => {
        setChipHide(!chipHide)
    }
    const setPirce = () => {
        setPriceHide(!priceHide)
    }

    return (
        <Card sx={{minWidth: 376 , boxShadow: '0 4px 16px 0 rgba(69,88,115,.2)'}}>
            <CardHeader title="Price Details" sx={{
                px: 2,
                '.MuiTypography-root':{
                    color: 'var(--text-color)',
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            }} />
            <CardContent sx={{
                pt: 0,
                px: 2
            }}>
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                        <div className={`${styles.labels} s-flex ai-ct cursor-p`} onClick={setPirce}>
                            <span>Tickets(1 Adult)</span>
                            <ExpandMoreIcon sx={{
                                transition:'transform .2s ease-in-out',
                                transform: !priceHide?'rotate(0deg)':'rotate(180deg)',
                            }} />
                        </div>
                        <div className={styles.values}>
                            <span>US$349.30</span>
                        </div>
                    </div>
                    <div className={`${styles.priceHeight} full-width`} style={{maxHeight: !priceHide?'0px':'1000px'}}>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span>Adults (Passenger 1)</span>
                            </div>
                            <div className={styles.values}>
                                <span>US$349.30 × 1</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span style={{fontSize: 12}}>Fare</span>
                            </div>
                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>US$329.70 × 1</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                <span style={{fontSize: 12}}>Taxes & fees</span>
                            </div>
                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>US$19.60 × 1</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.priceBox} s-flex flex-dir ai-ct jc-bt`}>
                    <div className={`${styles.priceli} s-flex ai-ct jc-bt full-width`}>
                        <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                            <span>Baggage</span>
                        </div>

                    </div>
                    <div className={`${styles.priceHeight} ${styles.baggage} full-width`}>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0
                            }} title={
                                <Typography fontSize={14} color={'#8592a6'}>
                                    Click to view baggage allowance details
                                </Typography>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Personal item</span>
                                </div>
                            </HtmlTooltip>

                            <div className={styles.values}>
                                <span style={{fontSize: 12}}>Check with airline</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '& .MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage allowance: <strong style={{color: 'var(--text-color)',fontSize: 14 , fontWeight: 'bold'}}>20 kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'#8592a6'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>

                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Carry-on baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12 , color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                        <div className={`${styles.priceli} s-flex ai-ct jc-bt`}>
                            <HtmlTooltip placement={'top'} sx={{
                                p: 0,
                                '& .MuiTooltip-tooltip': {
                                    maxWidth: 600, // 或设置固定宽度 width: 300
                                },
                            }} title={
                                <>
                                    <Typography fontSize={14} color={'var(--text-color)'}>Free baggage allowance: <strong style={{color: 'var(--text-color)',fontSize: 14 , fontWeight: 'bold'}}>20 kg</strong> per passenger</Typography>
                                    <Typography fontSize={14} color={'#8592a6'}>
                                        Click to view baggage allowance details
                                    </Typography>
                                </>
                            }>
                                <div className={`${styles.labels} s-flex ai-ct cursor-p`}>
                                    <span style={{fontSize: 12}}>Checked baggage</span>
                                </div>
                            </HtmlTooltip>
                            <div className={styles.values}>
                                <span style={{fontSize: 12 , color: '#06aebd'}}>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider
                    sx={{
                        borderTopStyle: 'dashed',
                        borderTopWidth: '1px',
                        borderColor: 'var(--put-border-color)',
                        borderBottomStyle: 'inherit',
                        mt:2
                    }}
                />
            </CardContent>
            <CardActions sx={{
                px: 2,
                pb: 3
            }}>
                <div className={`s-flex flex-dir jc-fe ai-fe full-width`}>
                    <div className={`${styles.priceLine} s-flex jc-bt ai-ct full-width`}>
                        <div className={styles.labels}>Total</div>
                        <div className={styles.prices}>US$440.60</div>
                    </div>
                    <HtmlTooltip sx={{
                        '.MuiTooltip-tooltip':{
                            maxWidth: 400
                        }
                    }} title={
                        <div className={styles.tripBox}>
                            <div className={styles.tripTitle}>Start Earning Trip Coins</div>
                            <Chip label="100 Trip Coins = US$1" size="medium" avatar={<Avatar src={T} sx={{
                                width: '18px !important',
                                height: '18px !important',
                            }} />} sx={{
                                height: '25px',
                                borderRadius: '2px',
                                borderColor: 'rgba(255,111,0,.32)',
                                background: '#f5f7fa',
                                mt: '8px',
                                '.MuiChip-label':{
                                    color: 'var(--text-color)'
                                }
                            }} />
                            <div className={`${styles.tripBoxFor} s-flex flex-dir ai-fs`}>
                                <div className={styles.tripBoxTitles}>
                                    For this trip
                                </div>
                                <div className={`${styles.tripBoxContent} s-flex`}>
                                    <CheckIcon sx={{
                                        fontSize:14,
                                        color:'#05939f',
                                        mt: '5px'
                                    }} />
                                    <div className={`s-flex flex-dir`} style={{textAlign:'left'}}>
                                        <div className={styles.tripBoxContentText}>You'll earn Trip Coins worth <strong> 0.25%</strong> of the booking total after your trip!</div>
                                        <div className={`${styles.tripBoxMore} s-flex ai-ct cursor-p`} onClick={setChip}>
                                            <div className={styles.tripBoxMoreText}>
                                                Details
                                            </div>
                                            <ExpandMoreIcon sx={{
                                                fontSize:20,
                                                color:'var(--active-color)',
                                                transition:'transform .2s ease-in-out',
                                                transform: chipHide?'rotate(0deg)':'rotate(180deg)',
                                            }} />
                                        </div>
                                        {
                                            chipHide && <Chip avatar={<Avatar src={C} sx={{
                                                width: '18px !important',
                                                height: '18px !important',
                                            }} />} variant="outlined" sx={{
                                                borderRadius: '2px',
                                                background: 'var(--vt-c-white)'
                                            }} label={
                                                <div className={`${styles.tripBoxMoreBox} s-flex ai-ct`}>
                                                    <div className={styles.ratio}>+10%</div>
                                                    <span>Become a gold member and earn 10% more</span>
                                                </div>
                                            } />
                                        }

                                    </div>

                                </div>

                            </div>
                            <div className={styles.tripBoxEarn}>
                                <div className={styles.tripBoxTitles}>
                                    How to Earn Trip Coins
                                </div>
                                <div className={`${styles.tripBoxContent} s-flex`}>

                                    <div className={styles.tripBoxContentText}>
                                        You'll earn Trip Coins each time you book with us. Trip Coins can be used to save on future bookings.
                                    </div>
                                </div>
                            </div>
                        </div>
                    }>
                        <Chip label="Trip Coins + 111" size="medium" avatar={<Avatar src={T} sx={{
                            width: '18px !important',
                            height: '18px !important',
                        }} />} variant="outlined"  sx={{
                            height: '25px',
                            borderRadius: '2px',
                            borderColor: 'rgba(255,111,0,.32)',
                            background: 'rgba(255,111,0,.08)',
                            mt: 1,
                            '.MuiChip-label':{
                                color: '#eb5600'
                            }
                        }} />
                    </HtmlTooltip>

                </div>

            </CardActions>
        </Card>
    )
})

const CardForm = memo(() => {
    const [gender, setGender] = useState('');

    const theme = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        fontSize: '16px',
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '16px',
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '16px',
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        fontSize: '16px',
                    },
                },
            },
        },
    })

    const handleSumbit = () => {

    }

    return (
        <div className={`${styles.cardFormContainer} full-width`}>
            <div className={styles.card}></div>
            <ThemeProvider theme={theme}>
                <form onSubmit={handleSumbit}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="Last name (surname)"
                                slotProps={{
                                    input:{
                                        endAdornment: <HelpOutlineIcon />
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="Given names"
                                slotProps={{
                                    input:{
                                        endAdornment: <HelpOutlineIcon />
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel>Gender on ID</InputLabel>
                                <Select value={gender} onChange={e => setGender(e.target.value)} label="Gender on ID">
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            sx: {
                                                fontSize: '16px',
                                                '& .MuiInputBase-input': {
                                                    fontSize: '16px',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: '16px',
                                                },
                                            },
                                        },
                                    }} label='Date of birth' />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid size={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="grouped-select">Nationality (country/region)</InputLabel>
                                <Select defaultValue="" id="grouped-select" label="Nationality (country/region)">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <ListSubheader>Category 1</ListSubheader>
                                    <MenuItem value={1}>Option 1</MenuItem>
                                    <MenuItem value={2}>Option 2</MenuItem>
                                    <ListSubheader>Category 2</ListSubheader>
                                    <MenuItem value={3}>Option 3</MenuItem>
                                    <MenuItem value={4}>Option 4</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="grouped-select">ID type</InputLabel>
                                <Select defaultValue="" id="grouped-select" label="ID type">
                                    <MenuItem value={1}>Option 1</MenuItem>
                                    <MenuItem value={2}>Option 2</MenuItem>
                                    <MenuItem value={3}>Option 3</MenuItem>
                                    <MenuItem value={4}>Option 4</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="ID number"
                            />
                        </Grid>
                    </Grid>
                </form>
            </ThemeProvider>
        </div>
    )
})

const Detail = memo(() => {
    return (
        <div className={`${styles.detailContainer} s-flex jc-bt`}>
            <div className={`${styles.leftDetail} s-flex flex-dir`}>
                <div className={`${styles.firportTitle} s-flex ai-fe`}>
                    <span>Trip to Shanghai</span>
                    <div className={`${styles.firportSet} cursor-p s-flex ai-ct`}>
                        <span>Change Flight</span>
                        <DriveFileRenameOutlineIcon sx={{
                            color:'var(--active-color)',
                            fontSize: 12,
                            fontWeight: 400,
                            ml: 0.5,
                        }} />
                    </div>
                </div>
                <div className={`${styles.firportInfomationBox} s-flex flex-dir`}>
                   <FirportInfomation />
                   <FirportInfomation />
                </div>
                <Passenger />
                <CardForm />
            </div>
            <div className={styles.cardCom}>
                <CardCom />
            </div>
        </div>
    )
})

export default Detail;
