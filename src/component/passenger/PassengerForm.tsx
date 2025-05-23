import {memo, useMemo, useState} from "react";
import styles from "@/component/passenger/styles.module.less";
import {
    Grid, FormControl,
    InputLabel, ListSubheader,
    TextField, MenuItem, Select, Button, Chip, Popover, Typography
} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Controller, useForm} from "react-hook-form";
import { Dayjs } from 'dayjs';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ErrorText from "../defult/ErrorText";

interface IFormInput {
    lastName: string;
    givenName: string;
    gender: string;
    dob: Dayjs|null;
    nationality: string;
    idType: string;
    idNumber: string;
}


const PassengerForm = memo(() => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const {control, handleSubmit, watch} = useForm<IFormInput>({
        mode: 'onChange',
        defaultValues: {
            lastName: '',
            givenName: '',
            gender: '',
            dob: null,
            nationality: '',
            idType: '',
            idNumber: '',
        }
    });

    const values = watch();

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


    const onSubmit = (data: IFormInput) => {
        console.log(data)
    }

    const renderPassenger = useMemo(() => {
        const last = /\d/.test(values.lastName) ? '' : values.lastName;
        const given = /\d/.test(values.givenName) ? '' : values.givenName;
        const fullName = `${last} ${given}`.trim();
        return fullName || 'Passenger';
    }, [values]);


    return (
        <div className={`${styles.passengerFormContainer} full-width`}>
            <div className={styles.traveling}>
                <div className={styles.travelingTitle}>
                    Who's Traveling?
                </div>
            </div>
            <div className={styles.commonBox}>
                <div className={styles.cardName}>{renderPassenger}</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="lastName"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s last name';
                                        }
                                        if (/\d/.test(value)) {
                                            return 'Special characters and symbols such as 1 cannot be entered in this field. Please remove all special characters and enter your name using standard English letters only.';
                                        }
                                        if (value && value === values.givenName) {
                                            return 'The "Last name" and "First & middle name" entered for this passenger are the same, please ensure you have entered them correctly.';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Last name (surname)"
                                            error={!!fieldState.error}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <HelpOutlineIcon/>
                                                }
                                            }}
                                        />

                                        <ErrorText message={fieldState.error?.message} />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                control={control}
                                name="givenName"
                                rules={{
                                    validate: (value) => {
                                        if (!value) {
                                            return 'Please enter the passenger\'s given names';
                                        }
                                        if (/\d/.test(value)) {
                                            return 'Special characters and symbols such as 1 cannot be entered in this field. Please remove all special characters and enter your name using standard English letters only.';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field, fieldState}) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Given names"
                                            error={!!fieldState.error}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <HelpOutlineIcon/>
                                                }
                                            }}
                                        />
                                        <ErrorText message={fieldState.error?.message} />

                                    </FormControl>

                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select a gender'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel>Gender on ID</InputLabel>
                                        <Select {...field} label="Gender on ID">
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                        <ErrorText message={fieldState.error?.message} />

                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="dob"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide a date of birth'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date of birth"
                                                value={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                slotProps={{
                                                    textField: {
                                                        error: !!fieldState.error,
                                                        fullWidth: true
                                                    }
                                                }}
                                            />
                                            <ErrorText message={fieldState.error?.message} />

                                        </LocalizationProvider>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={4}>
                            <Controller
                                name="nationality"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select a nationality'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel htmlFor="grouped-select">Nationality (country/region)</InputLabel>
                                        <Select {...field} id="grouped-select" label="Nationality (country/region)">
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <ListSubheader>Category 1</ListSubheader>
                                            <MenuItem value="1">Option 1</MenuItem>
                                            <MenuItem value="2">Option 2</MenuItem>
                                            <ListSubheader>Category 2</ListSubheader>
                                            <MenuItem value="3">Option 3</MenuItem>
                                            <MenuItem value="4">Option 4</MenuItem>
                                        </Select>
                                        <ErrorText message={fieldState.error?.message} />

                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                name="idType"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please select an ID type'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <InputLabel htmlFor="grouped-select">ID type</InputLabel>
                                        <Select {...field} id="grouped-select" label="ID type">
                                            <MenuItem value="1">Option 1</MenuItem>
                                            <MenuItem value="2">Option 2</MenuItem>
                                            <MenuItem value="3">Option 3</MenuItem>
                                            <MenuItem value="4">Option 4</MenuItem>
                                        </Select>
                                        <ErrorText message={fieldState.error?.message} />

                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={6}>
                            <Controller
                                name="idNumber"
                                control={control}
                                rules={{
                                    validate: value => value ? true : 'Please provide an ID number'
                                }}
                                render={({ field, fieldState }) => (
                                    <FormControl fullWidth error={!!fieldState.error}>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="ID number"
                                            error={!!fieldState.error}
                                        />
                                        <ErrorText message={fieldState.error?.message} />

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
})

export default PassengerForm
