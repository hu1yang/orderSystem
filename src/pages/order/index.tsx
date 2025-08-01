import SearchComponent from "@/component/order/search";
// import DayChoose from "@/component/order/day.tsx";
import styles from './styles.module.less'
import FilterData from "@/component/order/filterData.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {resetChoose, } from "@/store/orderInfo.ts";
import type {RootState} from "@/store";
import HistoryCom from "@/component/order/HistoryCom.tsx";
import DayChoose from "@/component/order/day.tsx";
import FilterComponent from "@/component/order/FilterComponent.tsx";

const Order = () => {
    const dispatch = useDispatch()
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData)

    useEffect(() => {
        dispatch(resetChoose())
    },[])

    return (
        <div className={styles.orderLayout}>
            <div className={styles.layoutWidth}>
                <SearchComponent />
                {
                    !!airSearchData.length && <DayChoose />
                }
                <div className={`${styles.mainContainer} s-flex jc-bt ai-fs`}>
                    {
                        airSearchData.length? (
                            <>
                                <FilterComponent />
                                <FilterData />
                            </>
                        ) : <HistoryCom />
                    }
                </div>
            </div>
        </div>
    )
}

export default Order;
