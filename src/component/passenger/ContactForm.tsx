import {memo, useEffect, useMemo} from "react";

import styles from './styles.module.less'
import {Controller, useForm} from "react-hook-form";
import {
    FormControl,
    Grid,
    InputAdornment,
    ListSubheader,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TextField
} from "@mui/material";
import type {IContact} from "@/types/order.ts";
import phoneCodesGrouped from "@/assets/phone_codes_grouped.json";
import {useDispatch} from "react-redux";
import {setContacts} from "@/store/orderInfo.ts";
import {debounce} from "@/utils/public.ts";

type IContactMore = IContact & {
    phoneCode:string
}

const ContactForm = memo(() => {
    const dispatch = useDispatch()

    const {control, watch , setValue} = useForm<IContactMore>({
        mode: 'onBlur',
        defaultValues: {
            contactName:'',
            emailAddress:'',
            phoneNumber: '',
            phoneCode:'+86'
        }
    });

    const watchFields = watch();

    const handleCodeChange = (event: SelectChangeEvent) => {
        setValue('phoneCode',event.target.value)
    }

    useEffect(() => {
        debounceValid(watchFields)
    }, [watchFields])


    const debounceValid = useMemo(() => debounce((
        fields
    ) => {
        const { contactName, emailAddress, phoneNumber, phoneCode } = fields as IContactMore;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d+$/;

        const isValid =
            contactName.trim() !== '' &&
            emailRegex.test(emailAddress) &&
            phoneRegex.test(phoneNumber!) &&
            phoneCode;

        if (isValid) {
            dispatch(setContacts({
                contactName,
                emailAddress,
                phoneNumber: (`${phoneCode}/${phoneNumber}`).replace(/^\+/, ''),
            }));
        }
    }, 300), []) // ✅ debounce 函数只创建一次

// 👇 使用时把最新字段传进去
    useEffect(() => {
        debounceValid(watchFields)
    }, [watchFields])




    return (
        <div className={styles.contactFormContainer}>
            <div className={styles.contactTitle}>
                Contact Details
            </div>
            <div className={styles.commonBox}>
                <form>
                    <Grid container spacing={2}>
                        <Grid size={4}>
                            <Controller
                                control={control}
                                name="contactName"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter a contact name';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Contact name"
                                        error={!!fieldState.error}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
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
                                        label="Email"
                                        error={!!fieldState.error}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
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
                                        label="Mobile phone"
                                        variant="outlined"
                                        {...field}
                                        type={'tel'}
                                        placeholder="Mobile phone"
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
                                                                value={watchFields.phoneCode}
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
                    </Grid>
                </form>
            </div>
        </div>
    )
})

export default ContactForm;
