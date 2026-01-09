import {forwardRef, useEffect, useImperativeHandle, useMemo} from "react";

import styles from './styles.module.less'
import {Controller, useForm, useWatch} from "react-hook-form";
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
import {getAgentSettingAgent} from "@/utils/request/agent.ts";
import {useTranslation} from "react-i18next";

type IContactMore = IContact & {
    phoneCode:string
}

const ContactForm = forwardRef((_,ref) => {
    const dispatch = useDispatch()
    const {t} = useTranslation();


    useImperativeHandle(ref,() => ({
        submit: async () => {
            return await new Promise<boolean>((resolve,reject) => {
                handleSubmit(
                    () => resolve(true),
                    () => reject(false)
                )()
            })
        }
    }))

    const {control, watch , setValue, handleSubmit} = useForm<IContactMore>({
        mode: 'onBlur',
        defaultValues: {
            contactName:'',
            emailAddress:'',
            phoneNumber: '',
            phoneCode:'+86'
        }
    });

    const fields = useWatch({
        control,
        name: ['contactName', 'emailAddress', 'phoneNumber', 'phoneCode']
    });

    useEffect(() => {
        debounceValid({
            contactName: fields[0],
            emailAddress: fields[1],
            phoneNumber: fields[2],
            phoneCode: fields[3],
        });
    }, [fields]);

    const watchFields = watch();

    const handleCodeChange = (event: SelectChangeEvent) => {
        setValue('phoneCode',event.target.value)
    }

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



    useEffect(() => {
        getAgentInfo()
    }, []);

    const getAgentInfo = async () => {
        try {
            const res = await getAgentSettingAgent();

            if (res && typeof res === 'object') {
                const { phoneNumber, contactName, emailAddress } = res;

                if (typeof phoneNumber === 'string' && phoneNumber.includes('/')) {
                    const phoneArr = phoneNumber.split('/').map(str => str.trim());
                    const [code, number] = phoneArr;

                    if (code && number) {
                        setValue('phoneCode', `+${code}`);
                        setValue('phoneNumber', number);
                    }
                }

                if (typeof contactName === 'string' && contactName.trim()) {
                    setValue('contactName', contactName.trim());
                }

                if (typeof emailAddress === 'string' && emailAddress.trim()) {
                    setValue('emailAddress', emailAddress.trim());
                }
            }
        } catch (error) {
            console.error('获取代理信息失败:', error);
        }
    };


    return (
        <div className={styles.contactFormContainer}>
            <div className={styles.contactTitle}>
                {t('passenger.contactDetails')}
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
                                        const trimmed = value?.trim();
                                        if (!trimmed) {
                                            return t('passenger.enterCountactName');
                                        }

                                        const pattern = /^[a-zA-Z]+\/[a-zA-Z]+$/;
                                        if (!pattern.test(trimmed)) {
                                            return t('passenger.enterName');
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label={t('passenger.contactName')}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
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
                                control={control}
                                name="phoneNumber"
                                rules={{
                                    validate: (value) => {
                                        if (!value) return t('passenger.enterPhoneNumber');
                                        if (!/^\d+$/.test(value)) return t('passenger.phoneNumberAllowed');
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        label={t('passenger.mobilePhone')}
                                        variant="outlined"
                                        {...field}
                                        type={'tel'}
                                        placeholder={t('passenger.mobilePhone')}
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
