import {memo, useMemo} from "react";
import styles from './styles.module.less'
import {Checkbox, Grid} from "@mui/material";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import type {Passenger} from "@/types/order.ts";
import {setSelectPassengers} from "@/store/orderInfo.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

const sex = {
    m:'Male',
    f:'Female'
}
const passengerTypes = {
    adt: 'Adult',
    chd: 'Child',
    inf: 'Infant',
} as const;
const PassengerList = memo(({passenger}:{
    passenger:Passenger
}) => {
    const selectPassengers = useSelector((state: RootState)=> state.ordersInfo.selectPassengers)
    const dispatch = useDispatch()

    const checkedPassenger = useMemo(() => {
        return selectPassengers.includes(passenger.idNumber)
    }, [passenger,selectPassengers]);


    return (
        <div className={`${styles.passengerList} cursor-p`} onClick={() => dispatch(setSelectPassengers(passenger.idNumber))}>
            <Grid container spacing={0}>
                <Grid size={1}>
                    <Checkbox checked={checkedPassenger} value={passenger.idNumber} onChange={() => dispatch(setSelectPassengers(passenger.idNumber))} onClick={(e) => e.stopPropagation()} />
                </Grid>
                <Grid size={10}>
                    <div className={styles.passengerName}>
                        {passenger.fullName}
                    </div>
                    <div className={styles.passengerInfo}>
                        <p>{passengerTypes[passenger.passengerType]} / {passenger.idCountry} ID Card {passenger.idNumber} / {sex[passenger.passengerSexType as 'm'|'f']} / {passenger.trCountry} </p>
                    </div>
                </Grid>
                <Grid size={1} className={`s-flex jc-fe`}>
                    <BorderColorIcon sx={{
                        color: 'var(--color-999)'
                    }} />
                </Grid>
            </Grid>
        </div>
    )
})

export default PassengerList
