import {forwardRef, memo, useImperativeHandle, useState} from "react";
import styles from "@/component/passenger/styles.module.less";
import {
    Grid, FormControl,
    InputLabel,
    TextField, MenuItem, Select, Button, Chip, Popover, Typography,
} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller, useForm} from "react-hook-form";
import dayjs from 'dayjs';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import type {Passenger} from "@/types/order.ts";




const PassengerForm = memo(forwardRef((_,ref) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);



    const {control, handleSubmit} = useForm<Passenger>({
        mode: 'onBlur',
        defaultValues: {
            title:'',
            fullName:'',
            idNumber:'',
            idCountry:'',
            trCountry:'',
            issuedDate:null,
            birthday:null,
            expiryDate:null,
            phoneNumber:'',
            emailAddress:'',
            passengerIdType:'pp',
            passengerType:'adt',
            passengerSexType:'m',
        }
    });


    const openPop = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget )
    }
    const handleClose = () => {
        // 移除焦点（失焦）
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setAnchorEl(null)
    }


    const onSubmit = (data: Passenger) => {
        console.log(data)
    }

    useImperativeHandle(ref,() => ({
        triggerSubmit: () =>
            new Promise((resolve, reject) => {
                handleSubmit(
                    (data) => resolve(data),
                    () => reject(null)
                )();
            })
    }))


    return (
        <div className={`${styles.passengerFormContainer} full-width`}>
            <div className={styles.traveling}>
                <div className={styles.travelingTitle}>
                    Who's Traveling?
                </div>
            </div>
            <div className={styles.commonBox}>
                <div className={styles.cardName}></div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="title"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s last name';
                                        }

                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Passenger Title"
                                        error={!!fieldState.error}
                                        slotProps={{
                                            input: {
                                                endAdornment: <HelpOutlineIcon/>
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="fullName"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s given names';
                                        }

                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="fullName"
                                        error={!!fieldState.error}
                                        slotProps={{
                                            input: {
                                                endAdornment: <HelpOutlineIcon/>
                                            }
                                        }}
                                    />

                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="idNumber"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide an ID number'
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="ID number"
                                        error={!!fieldState.error}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                control={control}
                                name="idCountry"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s idCountry';
                                        }
                                        if (value.length > 2) {
                                            return 'Cannot be greater than two digits';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="ID country"
                                        error={!!fieldState.error}
                                        slotProps={{
                                            input: {
                                                endAdornment: <HelpOutlineIcon/>
                                            }
                                        }}
                                    />

                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                control={control}
                                name="trCountry"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s trCountry';
                                        }
                                        if (value.length > 2) {
                                            return 'Cannot be greater than two digits';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="TR country"
                                        error={!!fieldState.error}
                                        slotProps={{
                                            input: {
                                                endAdornment: <HelpOutlineIcon/>
                                            }
                                        }}
                                    />

                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="issuedDate"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide a date of issuedDate'
                                }}
                                render={({ field, fieldState }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label='Issued date'
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => {
                                                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                console.log(formatted)
                                                field.onChange(formatted); // 存为字符串
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="birthday"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide a date of birthday'
                                }}
                                render={({ field, fieldState }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Date of birth"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => {
                                                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';

                                                field.onChange(formatted); // 存为字符串
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="expiryDate"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide a date of expiryDate'
                                }}
                                render={({ field, fieldState }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Date of birth"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => {
                                                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                field.onChange(formatted); // 存为字符串
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState.error?.message
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="phoneNumber"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s Phone number';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Phone number"
                                        error={!!fieldState.error}
                                        slotProps={{
                                            input: {
                                                endAdornment: <HelpOutlineIcon/>
                                            }
                                        }}
                                    />

                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="emailAddress"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please provide an Email address.';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email address"
                                        error={!!fieldState.error}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="passengerIdType"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select a Passenger Id type'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel id="passengerIdType-label">Passenger Id type</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="passengerIdType-label"
                                            label="Passenger Id type"
                                        >
                                            <MenuItem value="pp">pp</MenuItem>
                                            <MenuItem value="ni">ni</MenuItem>
                                            <MenuItem value="bd">bd</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="passengerType"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select a passenger Type'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel htmlFor="passengerType-select">passenger Type</InputLabel>
                                        <Select {...field} id="passengerType-select" label="passenger Type">
                                            <MenuItem value="adt">Aldult</MenuItem>
                                            <MenuItem value="chd">Child</MenuItem>
                                            <MenuItem value="inf">infant</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="passengerSexType"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select a passengerSexType'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel htmlFor="passengerSexType-select">Passenger sex type</InputLabel>
                                        <Select {...field} id="passengerSexType-select" label="passengerSexType">
                                            <MenuItem value="m">male</MenuItem>
                                            <MenuItem value="l">female</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Chip label={
                                <span>Please enter the name exactly as it appears on your travel documents for check-in. If the name is incorrect, you may not be able to board your flight and a cancellation fee will be charged.</span>
                            } sx={{
                                borderRadius: 0,
                                fontSize: 12,
                                backgroundColor: '#f5f7fa',
                                color: 'var(--text-color)',
                                height: 'auto',
                                padding: 'var(--pm-16) !important',
                                '& .MuiChip-label': {
                                    display: 'block',
                                    whiteSpace: 'normal',
                                },
                            }} />
                        </Grid>
                        <Grid size={12}>
                            <Button type="submit" sx={{
                                backgroundColor: 'var(--active-color)',
                                color:'var(--vt-c-white)',
                                fontSize: 14
                            }} fullWidth>Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <div className={`${styles.addForm} cursor-p `} onClick={openPop}>
                <div className={`${styles.textA} s-flex ai-ct jc-ct`}>
                    <span>Add Passengers</span>
                    <ControlPointIcon sx={{
                        fontSize: 18,
                        ml: 1,
                    }}/>
                </div>
            </div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ p: 2 , fontSize: 14 , color: 'var(--text-color)' }}>Please fill in all required fields and save first</Typography>
            </Popover>
        </div>
    )
}))

export default PassengerForm
