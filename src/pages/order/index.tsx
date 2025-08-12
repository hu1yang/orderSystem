import SearchComponent from "@/component/order/search";
import styles from './styles.module.less'
import FilterData from "@/component/order/filterData.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {resetChoose, } from "@/store/orderInfo.ts";
import type {RootState} from "@/store";
import DefaultShow from "@/component/order/defaultShow.tsx";
import DayChoose from "@/component/order/day.tsx";
import FilterComponent from "@/component/order/FilterComponent.tsx";
import {Alert, Snackbar} from "@mui/material";
import {resetSearch, setErrorMsg, setSearchFlag} from "@/store/searchInfo.ts";

const Order = () => {
    const dispatch = useDispatch()
    const searchFlag = useSelector((state: RootState) => state.searchInfo.searchFlag)
    const errMessage = useSelector((state: RootState) => state.searchInfo.errorMsg);

    useEffect(() => {
        dispatch(resetChoose())
        dispatch(resetSearch())
        dispatch(setSearchFlag(false))
    },[])


    const errClose = () => {
        dispatch(setErrorMsg(null))
    }

    return (
        <div className={styles.orderLayout}>
            <div className={styles.layoutWidth}>
                <SearchComponent />
                {
                    searchFlag && <DayChoose />
                }
                <div className={`${styles.mainContainer} s-flex jc-bt ai-fs`}>
                    {
                        searchFlag ? (
                            <>
                                <FilterComponent />
                                <FilterData />
                            </>
                        ) : <DefaultShow />
                    }
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'right' }}
                open={!!errMessage}
                autoHideDuration={2000}
                onClose={errClose}
            >
                <Alert
                    onClose={errClose}
                    severity="error"
                    variant="filled"
                    sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}
                >
                    {errMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Order;
