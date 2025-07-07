import SearchComponent from "@/component/order/search";
// import DayChoose from "@/component/order/day.tsx";
import FilterComponent from "@/component/order/FilterComponent.tsx";
import styles from './styles.module.less'
import FilterData from "@/component/order/filterData.tsx";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setChannelCode, setResult} from "@/store/orderInfo.ts";

const Order = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setChannelCode(''))
        dispatch(setResult(null))
    },[])

    return (
        <div className={styles.orderLayout}>
            <div className={styles.layoutWidth}>
                <SearchComponent/>
                {/*<DayChoose/>*/}
                <div className={`${styles.mainContainer} s-flex jc-bt ai-fs`}>
                    {/*<FilterComponent/>*/}
                    <FilterData/>
                </div>
            </div>
        </div>
    )
}

export default Order;
