import {memo, useCallback, useRef, useState} from "react";
import styles from "@/component/passenger/styles.module.less";
import {
    Grid, FormControl,
    InputLabel,
    TextField, MenuItem, Select, Button, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, InputAdornment, type SelectChangeEvent, ListSubheader,
} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller, useForm} from "react-hook-form";
import dayjs from 'dayjs';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import type {Passenger} from "@/types/order.ts";
import phoneCodesGrouped from '@/assets/phone_codes_grouped.json'
import {useDispatch, useSelector} from "react-redux";
import {setPassenger} from "@/store/orderInfo.ts";
import PassengerList from "@/component/passenger/list.tsx";
import type {RootState} from "@/store";


const passengerTitle:string[]=['Mr','Mrs','MS','Master','Miss']
const PassengerForm = memo(() => {
    const passengers = useSelector((state: RootState)=> state.ordersInfo.passengers)

    const dispatch = useDispatch()

    const [openPassenger, setOpenPassenger] = useState(false)

    const formType = useRef<number>(-1);

    const {control, handleSubmit , reset , setValue , watch , setError} = useForm<Passenger & {
        phoneCode?: string
    }>({
        mode: 'onBlur',
        defaultValues: {
            title:'',
            firstName:'',
            lastName:'',
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
            phoneCode: '+86',
        }
    });
    const phoneCode = watch('phoneCode');

    const openPop = () => {
        setOpenPassenger(true)
    }
    const handleClose = () => {
        formType.current === -1
        reset()
        setOpenPassenger(false)
    }


    const onSubmit = (data: Passenger & {
        phoneCode?: string
    }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (data.passengerType === 'adt' && data.birthday) {
            const birthDate = dayjs(data.birthday).toDate();
            const today = new Date();

            const age =
                today.getFullYear() - birthDate.getFullYear() -
                (today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

            if (age < 18) {
                setError('birthday', {
                    type: 'manual',
                    message: 'Passenger must be at least 18 years old for adult type.',
                });
                return;
            }
        }
        if (data.issuedDate) {
            const issuedDate = dayjs(data.issuedDate).toDate();
            if (issuedDate > today) {
                setError('issuedDate', {
                    type: 'manual',
                    message: 'Release date cannot be later than today',
                });
                return;
            }
        }
        if (data.expiryDate) {
            const expiryDate = dayjs(data.expiryDate).toDate();
            if (expiryDate < today) {
                setError('expiryDate', {
                    type: 'manual',
                    message: 'The certificate expiration date cannot be less than today',
                });
                return;
            }
        }


        if(formType.current === -1){
            const index = passengers.findIndex((passenger) => passenger.idNumber === data.idNumber)
            if(index > -1) {
                setError('idNumber', {
                    message: 'Duplicate user ID number',
                })
                return
            }
        }
        const passengerValue = {
            ...data,
            fullName: data.firstName +'/'+ data.lastName,
            phoneNumber: (data.phoneCode +'/'+ data.phoneNumber).replace(/^\+/, ''),
        }
        delete passengerValue.phoneCode
        delete passengerValue.firstName
        delete passengerValue.lastName
        dispatch(setPassenger({
            passenger:passengerValue,
            idnex:formType.current
        }))
        handleClose()
    }

    const handleCodeChange = (event: SelectChangeEvent) => {
        setValue('phoneCode',event.target.value)
    }

    const handleEditPassenger = useCallback((idNumber:string) => {
        const resultForm = passengers.find(a => a.idNumber === idNumber)
        const index = passengers.findIndex(a => a.idNumber === idNumber)
        formType.current = index
        if(!resultForm) return
        const names = typeof resultForm.fullName === 'string' ? resultForm.fullName.split('/') : [];
        const phone = typeof resultForm.phoneNumber === 'string' ? resultForm.phoneNumber.split('/') : [];
        reset({
            title:resultForm.title,
            firstName:names.length ? names[0]:'',
            lastName:names.length ? names[1]:'',
            idNumber:resultForm.idNumber,
            idCountry:resultForm.idCountry,
            trCountry:resultForm.trCountry,
            issuedDate:resultForm.issuedDate,
            birthday:resultForm.birthday,
            expiryDate:resultForm.expiryDate,
            phoneNumber:phone.length ? phone[1]:'',
            emailAddress:resultForm.emailAddress,
            passengerIdType: resultForm.passengerIdType,
            passengerType:resultForm.passengerType,
            passengerSexType:resultForm.passengerSexType,
            phoneCode: phone.length ? `+${phone[0]}`:'',
        })
        openPop()
    }, [passengers]);


    return (
        <div className={`${styles.passengerFormContainer} full-width`}>
            <div className={styles.traveling}>
                <div className={styles.travelingTitle}>
                    Who's Traveling?
                </div>
            </div>
            {
                passengers.length ?
                    <div className={styles.commonBox}>
                        <div className={styles.passengerBox}>
                            {
                                passengers.map((passenger,passengerIndex) => <PassengerList key={`${passenger.idNumber}-${passengerIndex}`} editPassenger={handleEditPassenger} passenger={passenger} />)
                            }
                        </div>
                    </div>:<></>
            }

            <div className={`${styles.addForm} cursor-p `} onClick={openPop}>
                <div className={`${styles.textA} s-flex ai-ct jc-ct`}>
                    <span>Add Passengers</span>
                    <ControlPointIcon sx={{
                        fontSize: 18,
                        ml: 1,
                    }}/>
                </div>
            </div>
            <Dialog
                open={openPassenger}
                maxWidth={'md'}
                onClose={handleClose}>
                <DialogTitle>
                    Passenger
                </DialogTitle>
                <DialogContent>
                    <div className={styles.commonBox}>
                        <form>
                            <Grid container spacing={2}>
                                <Grid size={4}>
                                    <Controller
                                        control={control}
                                        name="title"
                                        render={({field}) => (
                                            <FormControl fullWidth>
                                                <InputLabel id="passengerIdType-Title">Passenger Title</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="passenger Title"
                                                    label="Passenger Title"
                                                >
                                                    {
                                                        passengerTitle.map(pt => <MenuItem value={pt} key={pt}>{pt}</MenuItem>)

                                                    }
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <Controller
                                        control={control}
                                        name="firstName"
                                        rules={{
                                            validate: (value) => {
                                                if (!value) {
                                                    return 'Please enter your first name';
                                                }

                                                return true;
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="First name"
                                                error={!!fieldState.error}

                                            />

                                        )}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <Controller
                                        control={control}
                                        name="lastName"
                                        rules={{
                                            validate: (value) => {
                                                if (!value) {
                                                    return 'Please enter your last name';
                                                }

                                                return true;
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Last name"
                                                error={!!fieldState.error}

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
                                                helperText={fieldState.error?.message}
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
                                        name="idCountry"
                                        rules={{
                                            validate: (value) => {
                                                if (!value) return "Please enter the passenger's Id country";
                                                if (!/^[A-Z]{2}$/.test(value)) return 'Must be exactly 2 uppercase letters';
                                                return true;
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="ID country"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                onChange={(e) => {
                                                    // 将输入转换为大写并过滤非字母
                                                    let val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                                    if (val.length > 2) val = val.slice(0, 2);
                                                    field.onChange(val);
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
                                                if (!value) return "Please enter the passenger's TR country";
                                                if (!/^[A-Z]{2}$/.test(value)) return 'Must be exactly 2 uppercase letters';
                                                return true;
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="TR country"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                onChange={(e) => {
                                                    // 将输入转换为大写并过滤非字母
                                                    let val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                                    if (val.length > 2) val = val.slice(0, 2);
                                                    field.onChange(val);
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
                                                    label='Date of issued'
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
                                                    label="Date of expiry"
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
                                                if (!value) return 'Please enter the passenger\'s Phone number';
                                                if (!/^\d+$/.test(value)) return 'Only numbers are allowed';
                                                return true;
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Phone number"
                                                type={'tel'}
                                                error={!!fieldState.error}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    // 只允许数字
                                                    if (/^\d*$/.test(val)) {
                                                        field.onChange(val);
                                                    }
                                                }}
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <FormControl variant="standard" sx={{ minWidth: 60 }}>
                                                                    <Select
                                                                        value={phoneCode}
                                                                        onChange={handleCodeChange}
                                                                        disableUnderline
                                                                        size="small"
                                                                        renderValue={(selected) => selected}
                                                                        error={!!fieldState.error}
                                                                        MenuProps={{
                                                                            PaperProps: {
                                                                                sx: {
                                                                                    maxHeight: 300, // 👈 控制菜单高度
                                                                                },
                                                                            },
                                                                        }}
                                                                    >
                                                                        {Object.entries(phoneCodesGrouped).sort().flatMap(([letter, items]) => [
                                                                            <ListSubheader key={`header-${letter}`}>{letter}</ListSubheader>,
                                                                            ...items.map(({ code, label }) => (
                                                                                <MenuItem key={code + label} value={code}>
                                                                                    {code} {label}
                                                                                </MenuItem>
                                                                            ))
                                                                        ])}
                                                                    </Select>
                                                                </FormControl>
                                                            </InputAdornment>
                                                        )
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
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                if (!emailRegex.test(value)) {
                                                    return 'Please enter a valid Email address.';
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
                                                    <MenuItem value="adt">Adult</MenuItem>
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

                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" onClick={handleSubmit(onSubmit)} sx={{
                        backgroundColor: 'var(--active-color)',
                        color:'var(--vt-c-white)',
                        fontSize: 14
                    }} fullWidth>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})

export default PassengerForm
