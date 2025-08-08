import {memo, useEffect, useMemo, useState} from "react";

import {generateMonthlyDateRanges} from "@/utils/public.ts";
import {Tab, Tabs, tabsClasses} from "@mui/material";
import styles from './styles.module.less'
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import dayjs from "dayjs";
import {setErrorMsg, setLocalDate, setSearchFlag, setSearchLoad} from "@/store/searchInfo.ts";
import type {FQuery} from "@/types/order.ts";
import {getAuthorizableRoutingGroupAgent} from "@/utils/request/agent.ts";
import {deduplicateByChannelCode} from "@/utils/order.ts";
import {resetAirChoose, setNoData, setSearchDate, switchDay} from "@/store/orderInfo.ts";

interface IDay {
    label:string;
    value:string|{
        to:string
        from:string
    };
    key:string
}
const DayChoose = memo(() => {
    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const searchLoad = useSelector((state: RootState) => state.searchInfo.searchLoad)

    const dispatch = useDispatch()

    const isRound = useMemo(() => query.itineraryType === 'round', [query.itineraryType])

    const timeValue = useMemo(() => {
        if (isRound) {
            return {
                to: query.itineraries[1]?.departureDate ?? '',
                from: query.itineraries[0]?.departureDate ?? ''
            };
        } else {
            return query.itineraries[0]?.departureDate ?? '';
        }
    }, [query.itineraries, isRound]);

    useEffect(() => {
        if (!timeValue) return;

        let currentValue = '';
        if (isRound && typeof timeValue !== 'string') {
            currentValue = timeValue.to;
        } else if (!isRound && typeof timeValue === 'string') {
            currentValue = timeValue;
        }

        setDayValue(currentValue);

        const number = isRound && typeof timeValue !== 'string'
            ? Math.abs(dayjs(timeValue.from).diff(dayjs(timeValue.to), 'day'))
            : 0;

        const dateRanges = generateMonthlyDateRanges(number, isRound, timeValue);
        setDayArr(dateRanges);
    }, [isRound, timeValue]);

    const [dayArr, setDayArr] = useState<IDay[]>([])
    const [dayValue, setDayValue] = useState<string>('')

    // 切换时从 JSON 字符串恢复成对象（如你有需要）
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        if(searchLoad) return
        setDayValue(newValue);
        const date = dayArr.find(day => day.key === newValue)
        if(!date) return
        dispatch(resetAirChoose())
        dispatch(setSearchDate([]))
        dispatch(switchDay(date?.value))
        dispatch(setLocalDate(date?.value))
        searchData(date?.value)
    };

    const searchData = (date:string|{
        to:string
        from:string
    }) => {
        if(searchLoad) return
        dispatch(setNoData(false))
        dispatch(setSearchLoad(true))
        dispatch(setSearchFlag(true))
        const newResult = {...query}
        let newItineraries = newResult.itineraries
        if(isRound){
            newItineraries = newResult.itineraries.map(it => ({
                ...it,
                departureDate:(date  as {
                    to:string
                    from:string
                })[it.itineraryNo === 0 ? 'from' : 'to']
            }))
        }else{
            newItineraries = newResult.itineraries.map(it => ({
                ...it,
                departureDate:date as string
            }))
        }

        const result: FQuery = {
            ...newResult,
            travelers:newResult.travelers.filter(tr => tr.passengerCount>0),
            itineraries:newItineraries
        }

        getAuthorizableRoutingGroupAgent(result).then(res => {
            if(res.length){
                const objResult = deduplicateByChannelCode(res)
                dispatch(setSearchDate(objResult))
                const allFailed = objResult.every(a => a.succeed !== true)
                dispatch(setSearchLoad(false))

                if(allFailed){
                    dispatch(setSearchDate([]))
                    dispatch(setNoData(true))
                    dispatch(setErrorMsg('No suitable data'))
                }
            }else{
                dispatch(setSearchLoad(false))
                dispatch(setNoData(true))
                dispatch(setErrorMsg('No suitable data'))
            }
        }).catch(() => {
            dispatch(setSearchLoad(false))
            dispatch(setErrorMsg('Interface error'))
        })
    }

    return (
        <div className={`${styles.dayContainer} s-flex jc-bt`}>
            <div className={`${styles.dayChoose} flex-1`}>
                {
                    !!dayValue && (
                        <Tabs value={dayValue} onChange={handleChange}  variant="scrollable"
                              scrollButtons
                              aria-label="visible arrows tabs example"
                              sx={{
                                  '.MuiTab-root': {
                                      p: 0,
                                      position: 'relative',
                                      '&::before': {
                                          content: '""',
                                          position: 'absolute',
                                          height: 20,
                                          borderRight: '1px solid var(--put-border-color)',
                                          right: 0
                                      },
                                      '&:last-child::before': {
                                          content: 'none'
                                      },
                                      '&.Mui-selected span':{
                                          color: 'var(--put-border-hover-color) !important',

                                      }
                                  },
                                  [`& .${tabsClasses.scrollButtons}`]: {
                                      '&.Mui-disabled': { opacity: 0.3 },
                                  },
                                  '.MuiSvgIcon-root':{
                                      fontSize: 24,
                                  },
                                  '.MuiTabs-indicator': {
                                      backgroundColor: 'var(--text-color)',
                                  }
                              }}>
                            {
                                dayArr.map(item => (
                                    <Tab key={item.key} value={item.key} label={
                                        <div className={`${styles.dayItem} s-flex flex-dir ai-ct`}>
                                            <div className={styles.dayView}>
                                                <span>{item.label}</span>
                                            </div>
                                        </div>
                                    } />
                                ))
                            }
                        </Tabs>
                    )
                }

            </div>
        </div>
    )
})

export default DayChoose;
