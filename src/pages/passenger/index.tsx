import styles from './styles.module.less'
import {Step, StepLabel, Stepper, Typography} from "@mui/material";
import Detail from "@/component/passenger/detail.tsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {queryBookingAgent} from "@/utils/request/agetn.ts";
import {setResult} from "@/store/orderInfo.ts";

const Passenger = () => {
    const state = useSelector((state: RootState) => state.ordersInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        sendResult()
    },[])

    const sendResult = () => {
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
            }
        })
    }
    return (
        <div className={styles.passengerLayout}>
            <div className={styles.postionWhite}></div>
            <div className={styles.layoutWidth}>
                <div className={styles.setpContainer}>
                    <Stepper activeStep={0} sx={{
                        width: '100%',
                        '.MuiSvgIcon-root': {
                            width: '1.4em',
                            height: '1.4em',
                            '&.Mui-active':{
                                color: 'var(--active-color)',
                            },
                            '.MuiStepIcon-text':{
                                fontSize: 12,
                            }
                        },
                        '.MuiStepLabel-iconContainer,.MuiStep-root':{
                            p:0
                        },
                        '.MuiStepConnector-line':{
                            borderWidth: 4,
                            borderImage: 'linear-gradient(to right, var(--active-color) 50%, var(--put-border-color) 50%) 1 !important'
                        }
                    }}>
                        <Step>
                            <StepLabel />
                        </Step>
                        <Step>
                            <StepLabel />
                        </Step>
                    </Stepper>
                    <div className={`s-flex jc-bt ai-ct`}>
                        <Typography fontWeight={400} fontSize={14} color={'var(--active-color)'}>Fill in your info</Typography>
                        <Typography fontWeight={400} fontSize={14} color={'var(--text-color)'}>Finalize your payment</Typography>
                    </div>
                </div>
                <Detail />
            </div>
        </div>
    )
}

export default Passenger;
