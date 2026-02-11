import SearchComponent from "@/component/order/search";
import styles from './styles.module.less'
import FilterData from "@/component/order/filterData.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import type {RootState} from "@/store";
import DefaultShow from "@/component/order/defaultShow.tsx";
import DayChoose from "@/component/order/day.tsx";
import FilterComponent from "@/component/order/FilterComponent.tsx";
import {Alert, Snackbar} from "@mui/material";
import { setErrorMsg } from "@/store/searchInfo.ts";
import FixHeader from "@/component/order/fixHeader.tsx";
import {throttle} from "@/utils/public.ts";

const Order = () => {
    const dispatch = useDispatch()

    const dayRef = useRef<HTMLDivElement|null>(null);
    const fixRef = useRef<HTMLDivElement|null>(null);

    const searchFlag = useSelector((state: RootState) => state.searchInfo.searchFlag)
    const errMessage = useSelector((state: RootState) => state.searchInfo.errorMsg);
    const itineraryType = useSelector((state: RootState) => state.ordersInfo.query.itineraryType);
    const airSearchData = useSelector((state: RootState) => state.ordersInfo.airSearchData);

    useEffect(() => {

        const onScroll = throttle(() => {
            const el = dayRef.current
            const fixDom = fixRef.current
            if (!el || !fixDom) return
            const rect = el.getBoundingClientRect()
            if (rect.top <= 10) {
                fixDom.style.setProperty('--com-opacity', '1')
                fixDom.style.setProperty('--com-ZIndex', '99')
            } else {
                fixDom.style.setProperty('--com-opacity', '0')
                fixDom.style.setProperty('--com-ZIndex', '-1')
            }
        }, 16)

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    },[])


    const errClose = () => {
        dispatch(setErrorMsg(null))
    }

    return (
        <div className={styles.orderLayout}>
            <div className={styles.layoutWidth}>
                {
                    airSearchData.length > 0 && <FixHeader ref={fixRef} />
                }
                <SearchComponent />
                {
                    (
                        searchFlag && itineraryType !== 'multi'
                    ) && <DayChoose ref={dayRef} />
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
