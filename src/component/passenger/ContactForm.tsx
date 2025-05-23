import {memo} from "react";

import styles from './styles.module.less'
import {Controller, useForm} from "react-hook-form";
import {FormControl, Grid, InputAdornment, MenuItem, Select, type SelectChangeEvent, TextField} from "@mui/material";
import ErrorText from "@/component/defult/ErrorText.tsx";

interface IFormInput {
    contactName:string;
    email:string;
    mobilePhone:string | number;
    phoneCode:string;
}

const phoneCodes = [
    { code: '+1', label: 'US' },
    { code: '+44', label: 'UK' },
    { code: '+86', label: 'China' },
    { code: '+91', label: 'India' },
    // 你可以继续补充更多区号
]
const ContactForm = memo(() => {
    const {control, handleSubmit, watch , setValue} = useForm<IFormInput>({
        mode: 'onChange',
        defaultValues: {
            contactName:'',
            email:'',
            mobilePhone: '',
            phoneCode:'+91'
        }
    });

    const values = watch();


    const onSubmit = (data: IFormInput) => {
        console.log(data)
    }

    const handleCodeChange = (event: SelectChangeEvent) => {
        setValue('phoneCode',event.target.value)
    }

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
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Contact name"
                                            error={!!fieldState.error}

                                        />

                                        <ErrorText message={fieldState.error?.message} />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please provide an email address.';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Email"
                                            error={!!fieldState.error}
                                        />

                                        <ErrorText message={fieldState.error?.message} />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                control={control}
                                name="mobilePhone"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please provide a phone number';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
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
                                        <ErrorText message={fieldState.error?.message} />
                                    </FormControl>
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
