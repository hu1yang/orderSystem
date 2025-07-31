import SearchComponent from "@/component/order/search";
// import DayChoose from "@/component/order/day.tsx";
import styles from './styles.module.less'
import FilterData from "@/component/order/filterData.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setChannelCode, setResult} from "@/store/orderInfo.ts";
import type {RootState} from "@/store";
import HistoryCom from "@/component/order/HistoryCom.tsx";

const Order = () => {
    const dispatch = useDispatch()
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)

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
                    {
                        airSearchData.length? (
                            <>
                                {/*<FilterComponent/>*/}
                                <FilterData/>
                            </>
                        ) : <HistoryCom />
                    }
                </div>
            </div>
        </div>
    )
}

export default Order;
