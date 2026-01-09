import {forwardRef, memo, useEffect, useImperativeHandle} from "react";
import * as XLSX from 'xlsx'
import styles from "@/component/passenger/styles.module.less";
import {
    Grid, FormControl,
    InputLabel,
    TextField, MenuItem, Select, Chip,
    InputAdornment, type SelectChangeEvent, ListSubheader, Divider, Button, styled, Stack,
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import dayjs from '@/utils/dayjs.ts';
import type {ITravelerSex, Passenger, PassengerType} from "@/types/order.ts";
import phoneCodesGrouped from '@/assets/phone_codes_grouped.json'
import { useSelector} from "react-redux";
import type {RootState} from "@/store";
// @ts-ignore
import type {ControllerFieldState} from "react-hook-form/dist/types/controller";
// @ts-ignore
import type {Control} from "react-hook-form/dist/types/form";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {useTranslation} from "react-i18next";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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

const passengerTypes = {
    adt: 'Adult',
    chd: 'Child',
    inf: 'Infant',
} as const;

function formatDateString(dateStr?: string | null) {
    if (!dateStr) return null
    const parts = dateStr.trim().split('/')
    if (parts.length !== 3) return null
    const [day, month, year] = parts
    return `${year.padStart(4,'0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const PassengerForm = forwardRef(({setErrorFnc}:{
    setErrorFnc:(type:'success'|'error',msg:string) => void
},ref) => {
    const {t} = useTranslation()

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

                if (passenger.issuedDate) {
                    const issuedDate = dayjs(passenger.issuedDate).toDate();
                    if (issuedDate > today) {
                        setError(`passengers.${i}.issuedDate`, {
                            type: 'manual',
                            message: 'Release date cannot be later than today',
                        });
                        reject(new Error('Release date cannot be later than today'));
                        return;
                    }
                }

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


    const downTemplate = async () => {
        const res = await fetch(`${import.meta.env.VITE_BASE}/passengerTemplate.xlsx`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'passengerTemplate.xlsx';
        link.click();

        URL.revokeObjectURL(url);
    };

    const changeUploadFile = async (event: { target: HTMLInputElement; }) => {
        const input = event.target as HTMLInputElement
        const files = input.files
        if (!files || files.length === 0) return
        const file = files[0]

        try {
            const data = await file.arrayBuffer()
            const workbook = XLSX.read(data, { type: 'array', cellDates: true })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]

            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
                raw: false,
                defval: '',
            })

            const passenger: (Passenger & { phoneCode?: string })[] = []

            jsonData.forEach(data => {
                if(!data['Sequence']) return
                const titleRaw = data['Title'] || ''
                const title = titleRaw ? titleRaw[0].toUpperCase() + titleRaw.slice(1) : ''
                passenger.push({
                    title,
                    firstName: data['First Name(Given Name)'] || '',
                    lastName: data['Last Name(Surname)'] || '',
                    idNumber: data['Passport Number'] || '',
                    idCountry: data['Nationality'] || '',
                    trCountry: data['Passport Issued Country'] || '',
                    issuedDate: null,
                    birthday: formatDateString(data['DOB (dd/mm/yyyy)']) ?? null,
                    expiryDate: formatDateString(data['Passport Expiry (dd/mm/yyyy)']) ?? null,
                    phoneNumber: '',
                    emailAddress: '',
                    passengerIdType: 'pp',
                    passengerType: (data['Pax Type'] || '').toLowerCase() ?? 'adt',
                    passengerSexType: data['Gender'] === 'male' ? 'm' : 'f',
                    phoneCode: '+86',
                })
            })

            const passengerCount = travelers.reduce((acc, cur) => acc + cur.passengerCount, 0)
            if (passengerCount !== passenger.length) {
                setErrorFnc('error','Passenger numbers do not meet requirements')
                return
            }

            const typeMismatch = travelers.every(traveler => {
                const count = passenger.filter(p => p.passengerType === traveler.passengerType).length
                return count === traveler.passengerCount
            })

            if (!typeMismatch) {
                setErrorFnc('error','Passenger type does not match')
                return
            }

            replace(passenger)

        } catch {
            setErrorFnc('error','Please upload a suitable file.')
        } finally {
            event.target.value = '' // ✅ 确保可以重新上传同一个文件
        }
    }

    const handleCodeChange = (event: SelectChangeEvent,index:number) => {
        setValue(`passengers.${index}.phoneCode`,event.target.value)
    }

    return (
        <div className={`${styles.passengerFormContainer} full-width`}>
            <div className={styles.traveling}>
                <div className={styles.travelingTitle}>
                    {t('passenger.passengerInformation')}
                </div>
            </div>
            <div className={styles.commonBox}>
                <Button
                    component="label"
                    role={undefined}
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    {t('passenger.uploadPassengerInformation')}
                    <VisuallyHiddenInput
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={changeUploadFile}
                    />
                </Button>
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
                                    <Divider style={{marginBottom:'30px'}}>{t('passenger.passenger')} ({passengerTypes[field.passengerType]})</Divider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Grid container spacing={2}>
                                            <Grid size={4}>
                                                <Controller
                                                    control={control}
                                                    disabled={field.passengerType === 'inf'}
                                                    name={`passengers.${index}.title`}
                                                    render={({field}) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id="passengerIdType-Title">{t('passenger.passengerTitle')}</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId="passenger Title"
                                                                label={t('passenger.passengerTitle')}
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
                                                                return t('passenger.enterSureName');
                                                            }

                                                            return true;
                                                        }
                                                    }}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.surname')}
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
                                                                return t('passenger.enterGivenName');
                                                            }

                                                            return true;
                                                        }
                                                    }}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.givenName')}
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
                                                            label={t('passenger.IDNumber')}
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
                                                            if (!value) return t('passenger.enterIDCountry');
                                                            if (!/^[A-Z]{2}$/.test(value)) return t('passenger.enter2');
                                                            return true;
                                                        }
                                                    }}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.nationality')}
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
                                                            if (!value) return t('passenger.enterIssueCountry');
                                                            if (!/^[A-Z]{2}$/.test(value)) return t('passenger.enter2');
                                                            return true;
                                                        }
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.issueCountry')}
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
                                                    name={`passengers.${index}.birthday`}
                                                    control={control}
                                                    rules={{
                                                        validate: value => value ? true : t('passenger.enterBirthday')
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <DatePicker
                                                            label={t('passenger.dateBirth')}
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
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <Controller
                                                    name={`passengers.${index}.issuedDate`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <DatePicker
                                                            label={t('passenger.dateIssued')}
                                                            format="DD/MM/YYYY"
                                                            value={field.value ? dayjs(field.value) : null}
                                                            onChange={(date) => {
                                                                const formatted = date ? dayjs(date).format('YYYY-MM-DD') : '';
                                                                field.onChange(formatted); // 存为字符串
                                                            }}
                                                            maxDate={dayjs()}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    error: !!fieldState.error,
                                                                    helperText: fieldState.error?.message
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={4}>
                                                <Controller
                                                    name={`passengers.${index}.expiryDate`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <DatePicker
                                                            label={t('passenger.dateExpiry')}
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
                                                            if (!/^\d+$/.test(value)) return t('passenger.phoneNumberAllowed');
                                                            return true;
                                                        }
                                                    }}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.phoneNumber')}
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
                                                                return t('passenger.enterEmail');
                                                            }
                                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                            if (!emailRegex.test(value)) {
                                                                return t('passenger.validEmail');
                                                            }
                                                            return true;
                                                        }
                                                    }}
                                                    render={({field, fieldState}) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={t('passenger.email')}
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
                                                        validate: value => value ? true : t('passenger.enterPassengerId')
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <FormControl fullWidth error={!!fieldState.error}>
                                                            <InputLabel id="passengerIdType-label">{t('passenger.passengerIdType')}</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId="passengerIdType-label"
                                                                label={t('passenger.passengerIdType')}
                                                            >
                                                                <MenuItem value="pp">{t('passenger.passport')}</MenuItem>
                                                                <MenuItem value="ni">{t('passenger.nationalID')}</MenuItem>
                                                                <MenuItem value="bd">{t('passenger.birthDocument')}</MenuItem>
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
                                                        validate: value => value ? true : t('passenger.enterPassengerType')
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <FormControl fullWidth error={!!fieldState.error}>
                                                            <InputLabel htmlFor="passengerType-select">{t('passenger.passengerType')}</InputLabel>
                                                            <Select {...field} id="passengerType-select" disabled label={t('passenger.passengerType')}>
                                                                <MenuItem value="adt">{t('order.Adult')}</MenuItem>
                                                                <MenuItem value="chd">{t('order.Child')}</MenuItem>
                                                                <MenuItem value="inf">{t('order.Infant')}</MenuItem>
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
                                                        validate: value => value ? true : t('passenger.enterPassengerSexType')
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <FormControl fullWidth error={!!fieldState.error}>
                                                            <InputLabel htmlFor="passengerSexType-select">{t('passenger.passengerSexType')}</InputLabel>
                                                            <Select {...field} id="passengerSexType-select" label={t('passenger.passengerSexType')}>
                                                                <MenuItem value="m">{t('order.Male')}</MenuItem>
                                                                <MenuItem value="f">{t('order.Female')}</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </LocalizationProvider>
                                </div>
                            )
                        })
                    }
                </form>
                <Chip label={
                    <Stack spacing={2} direction="column">
                        <span>{t('passenger.enterTips')}</span>
                        <Button
                            component="label"
                            role={undefined}
                            color="success"
                            tabIndex={-1}
                            startIcon={<CloudDownloadIcon />}
                            onClick={downTemplate}
                        >
                            {t('passenger.downloadPassengerTemplate')}
                        </Button>
                    </Stack>
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
