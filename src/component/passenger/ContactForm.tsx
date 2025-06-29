import {forwardRef, memo, useImperativeHandle} from "react";

import styles from './styles.module.less'
import {Controller, useForm} from "react-hook-form";
import {FormControl, Grid, InputAdornment, MenuItem, Select, type SelectChangeEvent, TextField} from "@mui/material";
import type {IContact} from "@/types/order.ts";

type IContactMore = IContact & {
    phoneCode:string
}

const phoneCodes = [
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+86', label: 'China' },
    { code: '+91', label: 'India' },
    // 你可以继续补充更多区号
]
const ContactForm = memo(forwardRef((_,ref) => {
    const {control, handleSubmit, watch , setValue} = useForm<IContactMore>({
        mode: 'onBlur',
        defaultValues: {
            contactName:'',
            emailAddress:'',
            phoneNumber: '',
            phoneCode:'+91'
        }
    });

    const values = watch();


    const onSubmit = (data: IContactMore) => {
        console.log(data)
    }

    const handleCodeChange = (event: SelectChangeEvent) => {
        setValue('phoneCode',event.target.value)
    }

    useImperativeHandle(ref,() => ({
        triggerSubmit: () =>
            new Promise((resolve, reject) => {
                handleSubmit(
                    (data) => {
                        const newData = {
                            contactName:data.contactName,
                            emailAddress:data.emailAddress,
                            phoneNumber:data.phoneCode+"/"+data.phoneNumber
                        }
                        return resolve(newData)
                    },
                    () => reject(null)
                )();
            })
    }))

    return (
        <div className={styles.contactFormContainer}>
            <div className={styles.contactTitle}>
                Contact Details
            </div>
            <div className={styles.commonBox}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                            return 'Please provide an email address.';
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
                                        if (!value) {
                                            return 'Please provide a phone number';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <TextField
                                        label="Mobile phone"
                                        variant="outlined"
                                        {...field}
                                        placeholder="Mobile phone"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FormControl variant="standard" sx={{ minWidth: 60 }}>
                                                        <Select
                                                            value={values.phoneCode}
                                                            onChange={handleCodeChange}
                                                            disableUnderline
                                                            size="small"
                                                            renderValue={(selected) => selected}
                                                            error={!!fieldState.error}
                                                        >
                                                            {phoneCodes.map(({ code, label }) => (
                                                                <MenuItem key={code} value={code}>
                                                                    {code} {label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </InputAdornment>
                                            ),
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
}))

export default ContactForm;
