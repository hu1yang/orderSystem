import Orderlayout from "@/component/order/layout";
import SearchComponent from "@/component/order/search";
import DayChoose from "@/component/order/day.tsx";
import FilterComponent from "@/component/order/FilterComponent.tsx";
import styles from './styles.module.less'
import FilterData from "@/component/order/FilterData.tsx";

const Order = () => {
    return (
        <Orderlayout>
            <SearchComponent />
            <DayChoose />
            <div className={`${styles.mainContainer} s-flex jc-bt`}>
                <FilterComponent />
                <FilterData />
            </div>
        </Orderlayout>
    )
}

export default Order;
