import styles from './styles.module.less'
import Detail from "@/component/passenger/detail.tsx";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {queryBookingAgent} from "@/utils/request/agetn.ts";
import {setResult} from "@/store/orderInfo.ts";
import {useNavigate} from "react-router";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const Passenger = () => {
    const navigate = useNavigate()


    const state = useSelector((state: RootState) => state.ordersInfo)
    const load = useRef(false);
    const dispatch = useDispatch()

    const [dialogVisible, setDialogVisible] = useState(false)

    useEffect(() => {
        if(!state.airChoose.result){
            navigate('/')
        }else{
            sendResult()
        }
    },[])

    const sendResult = () => {
        if(load.current) return
        load.current = true;
        const newTravelers = state.query.travelers.filter(traveler => traveler.passengerCount>0)
        queryBookingAgent({
            ...state.airChoose,
            request:{
                ...state.query,
                travelers:newTravelers
            }
        }).then(res => {
            if(res.succeed){
                dispatch(setResult(res.response))
            }else{
                setDialogVisible(true)
            }
            load.current = false;
        })
    }
    const returnBack = () => {
        setDialogVisible(false)
        setTimeout(() => {
            navigate('/')
        },200)
    }
    return (
        <div className={styles.passengerLayout}>
            <Detail />
            <Dialog
                open={dialogVisible}
                maxWidth={"md"}
                sx={{
                    '.MuiDialog-paperWidthMd': {
                        width: '400px'
                    }
                }}
            >
                <DialogTitle sx={{
                    fontSize: '1.5rem',
                }}>
                    {"Price Invalidation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{
                        fontSize: '1.3rem',
                    }}>
                        Please return to place the order again
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={returnBack} autoFocus sx={{
                        fontSize: '1.3rem',
                    }}>
                        Return
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Passenger;
