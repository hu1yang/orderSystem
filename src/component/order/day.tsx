import {memo, useEffect, useState} from "react";

import {generateMonthlyDateRanges} from "@/utils/public.ts";
import {Tab, Tabs, tabsClasses} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import styles from './styles.module.less'

interface IDay {
    label:string;
    price:string;
}
const DayChoose = memo(() => {
    const [dayArr, setDayArr] = useState<IDay[]>([])
    const [dayValue, setDayValue] = useState(0)

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setDayValue(newValue);
    };

    useEffect(() => {
        const dateRanges = generateMonthlyDateRanges()
        setDayArr(dateRanges)
    }, []);
    return (
        <div className={`${styles.dayContainer} s-flex jc-bt`}>
            <div className={`${styles.dayChoose} flex-1`}>
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
                                  borderRight: '1px solid #dadfe6',
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
                              backgroundColor: '#0f294d',
                          }
                      }}>
                    {
                        dayArr.map((item,index) => (
                            <Tab key={index} label={
                                <div className={`${styles.dayItem} s-flex flex-dir ai-ct`}>
                                    <div className={styles.dayView}>
                                        <span>{item.label}</span>
                                    </div>
                                    <div className={styles.moneyView}>
                                        <span>{item.price || 'View'}</span>
                                    </div>
                                </div>
                            } />
                        ))
                    }
                </Tabs>
            </div>
            <div className={`${styles.dayChartBtn} s-flex flex-dir ai-ct jc-ct cursor-p`}>
                <CalendarMonthIcon sx={{fontSize: 18}} />
                <span>Price Table</span>
            </div>
        </div>
    )
})

export default DayChoose;
