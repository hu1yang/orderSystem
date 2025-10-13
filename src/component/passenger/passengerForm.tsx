import {forwardRef, memo, useEffect, useImperativeHandle} from "react";
import styles from "@/component/passenger/styles.module.less";
import {
    Grid, FormControl,
    InputLabel,
    TextField, MenuItem, Select,  Chip,
    InputAdornment, type SelectChangeEvent, ListSubheader, Divider,
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import dayjs from 'dayjs';
import type {ITravelerSex, Passenger, PassengerType} from "@/types/order.ts";
import phoneCodesGrouped from '@/assets/phone_codes_grouped.json'
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
// @ts-ignore
import type {ControllerFieldState} from "react-hook-form/dist/types/controller";
// @ts-ignore
import type {Control} from "react-hook-form/dist/types/form";

type PassengerTitle = 'Master' | 'Miss' | 'Mr' | 'Mrs' | 'Ms'
const titleMapping = {
    'Master': { type: 'chd', sex: 'm' },
    'Miss': { type: 'chd', sex: 'f' },
    'Mr': { type: 'adt', sex: 'm' },
    'Mrs': { type: 'adt', sex: 'f' },
    'Ms': { type: 'adt', sex: 'f' },
    // 可以添加更多映射
};

const PhoneCodeCom = memo(({handleCodeChangeCom,fieldState,index,control}:{
    handleCodeChangeCom:(event:SelectChangeEvent,index:number) => void
    fieldState:ControllerFieldState
    index:number
    control:Control
}) => {
    const phoneCode = useWatch({
        control,
        name: `passengers.${index}.phoneCode`,
    });
    return (
        <Select
            value={phoneCode}
            onChange={(event:SelectChangeEvent) => handleCodeChangeCom(event,index)}
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
    )
})

const PassengerForm = forwardRef((_,ref) => {
    const travelers = useSelector((state: RootState)=> state.ordersInfo.query.travelers)

    useEffect(() => {
        const newPassengers: (
            Passenger & {
            phoneCode?: string
        })[] = []
        travelers.forEach(traveler => {
            for (let i = 0; i < traveler.passengerCount; i++) {
                newPassengers.push({
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
                    passengerType: traveler.passengerType as PassengerType,
                    passengerSexType:'m',
                    phoneCode: '+86',
                })
            }
        })

        replace(newPassengers) // 替换已有的 passengers
    }, [travelers]);

    useImperativeHandle(ref, () => ({
        submit: async () => {
            return await new Promise<Passenger[]>((resolve, reject) => {
                handleSubmit(
                    (data) => {
                        onSubmit(data)
                        .then(() => resolve(data.passengers))
                        .catch((err) => reject(err));
                    },
                    () => {
                        reject(new Error('Form validation failed'));
                    }
                )();
            });
        }
    }));





    const {control , setValue , handleSubmit , setError} = useForm<{
        passengers:(
            Passenger & {
            phoneCode?: string
        })[]
    }>({
        mode: 'onBlur',
        defaultValues: {
            passengers:[
            ]
        }
    });

    const { fields, replace } = useFieldArray({
        control,
        name: 'passengers',
    })


    const onSubmit = (data: { passengers: (Passenger & { phoneCode?: string })[] }) => {
        return new Promise<void>((resolve, reject) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const idNumberMap = new Map<string, number>();

            for (let i = 0; i < data.passengers.length; i++) {
                const passenger = data.passengers[i];

                if (passenger.idNumber && passenger.idNumber.trim()) {
                    const cleanIdNumber = passenger.idNumber.trim();

                    if (idNumberMap.has(cleanIdNumber)) {
                        const duplicateIndex = idNumberMap.get(cleanIdNumber)!;
                        setError(`passengers.${i}.idNumber`, {
                            type: 'manual',
                            message: 'Duplicate ID number with another passenger.',
                        });
                        setError(`passengers.${duplicateIndex}.idNumber`, {
                            type: 'manual',
                            message: 'Duplicate ID number with another passenger.',
                        });
                        reject(new Error('Duplicate ID number in form'));
                        return;
                    }
                    idNumberMap.set(cleanIdNumber, i);
                }

                if (passenger.birthday) {
                    const birthDate = dayjs(passenger.birthday).toDate();

                    if (birthDate > today) {
                        setError(`passengers.${i}.birthday`, {
                            type: 'manual',
                            message: 'Birthday cannot be in the future.',
                        });
                        reject(new Error('Birthday cannot be in the future.'));
                        return;
                    }

                    const age =
                        today.getFullYear() - birthDate.getFullYear() -
                        (today.getMonth() < birthDate.getMonth() ||
                        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
                            ? 1
                            : 0);

                    if (passenger.passengerType === 'adt' && age < 12) {
                        setError(`passengers.${i}.birthday`, {
                            type: 'manual',
                            message: 'Adult must be at least 12 years old.',
                        });
                        reject(new Error('Adult must be at least 12 years old.'));
                        return;
                    }

                    if (passenger.passengerType === 'chd' && (age < 2 || age >= 12)) {
                        setError(`passengers.${i}.birthday`, {
                            type: 'manual',
                            message: 'Children must be between 2 and 11 years old.',
                        });
                        reject(new Error('Children must be between 2 and 11 years old.'));
                        return;
                    }

                    if (passenger.passengerType === 'inf' && age >= 2) {
                        setError(`passengers.${i}.birthday`, {
                            type: 'manual',
                            message: 'Infants must be under 2 years old.',
                        });
                        reject(new Error('Infants must be under 2 years old.'));
                        return;
                    }
                }

                // if (passenger.issuedDate) {
                //     const issuedDate = dayjs(passenger.issuedDate).toDate();
                //     if (issuedDate > today) {
                //         setError(`passengers.${i}.issuedDate`, {
                //             type: 'manual',
                //             message: 'Release date cannot be later than today',
                //         });
                //         reject(new Error('Release date cannot be later than today'));
                //         return;
                //     }
                // }

                if (passenger.expiryDate) {
                    const expiryDate = dayjs(passenger.expiryDate).toDate();
                    if (expiryDate < today) {
                        setError(`passengers.${i}.expiryDate`, {
                            type: 'manual',
                            message: 'The certificate expiration date cannot be less than today',
                        });
                        reject(new Error('The certificate expiration date cannot be less than today'));
                        return;
                    }
                }

                passenger.fullName = `${passenger.firstName}/${passenger.lastName}`;
                passenger.phoneNumber = passenger.phoneNumber ? (passenger.phoneCode + '/' + passenger.phoneNumber).replace(/^\+/, '') : '';
                delete passenger.phoneCode;
                delete passenger.firstName;
                delete passenger.lastName;
            }


            resolve();
        });
    };





    const handleCodeChange = (event: SelectChangeEvent,index:number) => {
        setValue(`passengers.${index}.phoneCode`,event.target.value)
    }

    return (
        <div className={`${styles.passengerFormContainer} full-width`}>
            <div className={styles.traveling}>
                <div className={styles.travelingTitle}>
                    Who's Traveling?
                </div>
            </div>
            <div className={styles.commonBox}>
                <form>
                    {
                        fields.map((field,index) => {
                            let passengerTitleFilter:PassengerTitle|string[] = []
                            switch (field.passengerType) {
                                case "adt":
                                    passengerTitleFilter = ['Mr','Mrs','Ms']
                                    break
                                case 'chd':
                                    passengerTitleFilter = ['Master','Miss']
                                    break
                                case 'inf':
                                    passengerTitleFilter = ['']
                                    break

                            }
                            return (
                                <div key={field.id} style={{margin:'30px 0'}}>
                                    <Divider style={{marginBottom:'30px'}}>Passenger ({field.passengerType})</Divider>
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <Controller
                                                control={control}
                                                disabled={field.passengerType === 'inf'}
                                                name={`passengers.${index}.title`}
                                                render={({field}) => (
                                                    <FormControl fullWidth>
                                                        <InputLabel id="passengerIdType-Title">Passenger Title</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId="passenger Title"
                                                            label="Passenger Title"
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                const {value} = e.target
                                                                const mapping = titleMapping[value as PassengerTitle] || { type: 'inf', sex: '' };
                                                                setValue(`passengers.${index}.passengerType`, mapping.type as PassengerType);
                                                                setValue(`passengers.${index}.passengerSexType`, mapping.sex as ITravelerSex);
                                                            }}
                                                        >
                                                            {
                                                                passengerTitleFilter.map(pt => <MenuItem value={pt} key={pt}>{pt||'none'}</MenuItem>)
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <Controller
                                                control={control}
                                                name={`passengers.${index}.firstName`}
                                                rules={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return 'Please enter your Surname';
                                                        }

                                                        return true;
                                                    }
                                                }}
                                                render={({field, fieldState}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Surname"
                                                        error={!!fieldState.error}
                                                        onChange={(e) => {
                                                            // 将输入转换为大写并过滤非字母
                                                            const val = e.target.value.toUpperCase();
                                                            field.onChange(val);
                                                        }}
                                                    />

                                                )}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <Controller
                                                control={control}
                                                name={`passengers.${index}.lastName`}
                                                rules={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return 'Please enter your Given Name';
                                                        }

                                                        return true;
                                                    }
                                                }}
                                                render={({field, fieldState}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Given Name"
                                                        error={!!fieldState.error}
                                                        onChange={(e) => {
                                                            // 将输入转换为大写并过滤非字母
                                                            const val = e.target.value.toUpperCase();
                                                            field.onChange(val);
                                                        }}

                                                    />

                                                )}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <Controller
                                                name={`passengers.${index}.idNumber`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="ID number"
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                        onChange={(e) => {
                                                            // 将输入转换为大写并过滤非字母
                                                            const val = e.target.value.toUpperCase();
                                                            field.onChange(val);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <Controller
                                                control={control}
                                                name={`passengers.${index}.idCountry`}
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
                                                        label="Nationality"
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
                                                name={`passengers.${index}.trCountry`}
                                                rules={{
                                                    validate: (value) => {
                                                        if (!value) return "Please enter the passenger's Issue country";
                                                        if (!/^[A-Z]{2}$/.test(value)) return 'Must be exactly 2 uppercase letters';
                                                        return true;
                                                    }
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label="Issue country"
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
                                        <Grid size={6}>
                                            <Controller
                                                name={`passengers.${index}.birthday`}
                                                control={control}
                                                rules={{
                                                    validate: value => value ? true : 'Please provide a date of birthday'
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date of birth"
                                                            format="DD/MM/YYYY"
                                                            maxDate={dayjs()}
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
                                        {/*<Grid size={4}>*/}
                                        {/*    <Controller*/}
                                        {/*        name={`passengers.${index}.issuedDate`}*/}
                                        {/*        control={control}*/}
                                        {/*        rules={{*/}
                                        {/*            validate: value => value ? true : 'Please provide a date of issuedDate'*/}
                                        {/*        }}*/}
                                        {/*        render={({ field, fieldState }) => (*/}
                                        {/*            <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                                        {/*                <DatePicker*/}
                                        {/*                    label='Date of issued'*/}
                                        {/*                    format="DD/MM/YYYY"*/}
                                        {/*                    value={field.value ? dayjs(field.value) : null}*/}
                                        {/*                    onChange={(date) => {*/}
                                        {/*                        const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';*/}
                                        {/*                        field.onChange(formatted); // 存为字符串*/}
                                        {/*                    }}*/}
                                        {/*                    maxDate={dayjs()}*/}
                                        {/*                    slotProps={{*/}
                                        {/*                        textField: {*/}
                                        {/*                            fullWidth: true,*/}
                                        {/*                            error: !!fieldState.error,*/}
                                        {/*                            helperText: fieldState.error?.message*/}
                                        {/*                        },*/}
                                        {/*                    }}*/}
                                        {/*                />*/}
                                        {/*            </LocalizationProvider>*/}
                                        {/*        )}*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        <Grid size={6}>
                                            <Controller
                                                name={`passengers.${index}.expiryDate`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label="Date of expiry"
                                                            format="DD/MM/YYYY"
                                                            value={field.value ? dayjs(field.value) : null}
                                                            onChange={(date) => {
                                                                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                                field.onChange(formatted); // 存为字符串
                                                            }}
                                                            minDate={dayjs()}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    error: !!fieldState.error,
                                                                    helperText: fieldState.error?.message,
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
                                                name={`passengers.${index}.phoneNumber`}
                                                rules={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return true
                                                        }
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
                                                                            <PhoneCodeCom handleCodeChangeCom={handleCodeChange} control={control} index={index} fieldState={fieldState} />
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
                                                name={`passengers.${index}.emailAddress`}
                                                rules={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return true
                                                        }
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
                                                name={`passengers.${index}.passengerIdType`}
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
                                                            <MenuItem value="pp">Passport</MenuItem>
                                                            <MenuItem value="ni">National ID</MenuItem>
                                                            <MenuItem value="bd">Birth Document</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <Controller
                                                name={`passengers.${index}.passengerType`}
                                                control={control}
                                                rules={{
                                                    validate: value => value ? true : 'Please select a passenger Type'
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                        <InputLabel htmlFor="passengerType-select">passenger Type</InputLabel>
                                                        <Select {...field} id="passengerType-select" disabled label="passenger Type">
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
                                                name={`passengers.${index}.passengerSexType`}
                                                control={control}
                                                rules={{
                                                    validate: value => value ? true : 'Please select a passengerSexType'
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <FormControl fullWidth error={!!fieldState.error}>
                                                        <InputLabel htmlFor="passengerSexType-select">Passenger sex type</InputLabel>
                                                        <Select {...field} id="passengerSexType-select" label="passengerSexType">
                                                            <MenuItem value="m">Male</MenuItem>
                                                            <MenuItem value="f">Female</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                        })
                    }
                </form>
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
            </div>
        </div>
    )
})

export default memo(PassengerForm)
