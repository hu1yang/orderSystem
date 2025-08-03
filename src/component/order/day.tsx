import {memo, useEffect, useMemo, useState} from "react";

import {generateMonthlyDateRanges} from "@/utils/public.ts";
import {Tab, Tabs, tabsClasses} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './styles.module.less'
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import dayjs from "dayjs";

interface IDay {
    label:string;
    value:string|{
        to:string
        from:string
    };
}
const DayChoose = memo(() => {
    const query = useSelector((state: RootState) => state.ordersInfo.query)

    const isRound = useMemo(() => query.itineraryType === 'round', [query.itineraryType])

    const timeValue = useMemo(() => {
        if (isRound) {
            return {
                to: query.itineraries[0]?.departureDate ?? '',
                from: query.itineraries[1]?.departureDate ?? ''
            };
        } else {
            return query.itineraries[0]?.departureDate ?? '';
        }
    }, [query.itineraries, isRound]);

    useEffect(() => {
        if (!timeValue) return;

        let currentValue = '';
        if (isRound && typeof timeValue !== 'string') {
            currentValue = JSON.stringify(timeValue);
        } else if (!isRound && typeof timeValue === 'string') {
            currentValue = JSON.stringify(timeValue);
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
        const parsed = JSON.parse(newValue); // 可根据需要使用 parsed
        setDayValue(parsed);
    };




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
                                dayArr.map((item,index) => (
                                    <Tab key={index} value={JSON.stringify(item.value)} label={
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
            {/*<div className={`${styles.dayChartBtn} s-flex flex-dir ai-ct jc-ct cursor-p`}>*/}
            {/*    <CalendarMonthIcon sx={{fontSize: 18}} />*/}
            {/*    <span>Price Table</span>*/}
            {/*</div>*/}
        </div>
    )
})

export default DayChoose;
