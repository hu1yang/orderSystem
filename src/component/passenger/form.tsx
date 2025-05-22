import {memo, useState} from "react";
import styles from "@/component/passenger/styles.module.less";
import {Grid,  FormControl,
    InputLabel, ListSubheader,
    TextField, MenuItem, Select} from "@mui/material";

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


const CardForm = memo(() => {
    const [gender, setGender] = useState('');


    const handleSumbit = () => {

    }

    return (
        <div className={`${styles.cardFormContainer} full-width`}>
            <div className={styles.card}></div>
            <form onSubmit={handleSumbit}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Last name (surname)"
                            slotProps={{
                                input: {
                                    endAdornment: <HelpOutlineIcon/>
                                }
                            }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Given names"
                            slotProps={{
                                input: {
                                    endAdornment: <HelpOutlineIcon/>
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
                                <DatePicker label="Date of birth"/>
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
        </div>
    )
})

export default CardForm
