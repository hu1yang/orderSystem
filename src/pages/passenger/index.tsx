import styles from './styles.module.less'
import Detail from "@/component/passenger/detail.tsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {queryBookingAgent} from "@/utils/request/agetn.ts";
import {setResult} from "@/store/orderInfo.ts";
import {useNavigate} from "react-router";

const Passenger = () => {
    const navigate = useNavigate()


    const state = useSelector((state: RootState) => state.ordersInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        if(!state.airChoose.result){
            navigate('/')
        }else{
            // sendResult()
        }
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
            <Detail />
        </div>
    )
}

export default Passenger;
