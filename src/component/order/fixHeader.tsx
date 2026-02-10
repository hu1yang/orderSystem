import styles from "./styles.module.less"
import {Stack, Typography} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DayChoose from "@/component/order/day.tsx";
import BorderColorSharpIcon from '@mui/icons-material/BorderColorSharp';
import {useMemo} from "react";
import {cabinOptions, isZhCN} from "@/utils/public.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import dayjs from "@/utils/dayjs.ts";


const FixHeader = () => {
    const {t} = useTranslation();

    const query = useSelector((state: RootState) => state.ordersInfo.query)
    const airportActived = useSelector((state: RootState) => state.ordersInfo.airportActived)
    const cityList = useSelector((state: RootState) => state.ordersInfo.cityList)

    const canbinLabel = useMemo(() => {
        const cabinOption = cabinOptions.find(op => op.value === query.cabinLevel)
        return t(`order.${cabinOption?.label}`) ?? t('order.economy')
    }, [query]);

    const countAll = useMemo(() => {
        return query.travelers.reduce((sum, t) => sum + t.passengerCount, 0)
    }, [query]);

    const itinerariesMemo = useMemo(() => {
        return query.itineraries.map(itiner => ({
            ...itiner,
            arrivalName: cityList.find(city => city?.cityCode === itiner.arrival || city?.airportCode === itiner.arrival)?.[isZhCN ? 'cityCName' : 'cityEName'],
            departureName:cityList.find(city => city?.cityCode === itiner.departure || city?.airportCode === itiner.departure)?.[isZhCN ? 'cityCName' : 'cityEName']
        }))??[]
    },[query.itineraries,cityList])

    const journey = useMemo(() => {
        console.log(itinerariesMemo)
        return itinerariesMemo.find(i => i.itineraryNo === airportActived) || null
    },[itinerariesMemo,airportActived])

    const backTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <div className={styles.fixHeader}>
            <div className={`${styles.fixHeaderContent} flex`}>
                {
                    journey && (
                        <div className={`${styles.airInfo} flex jc-ct flex-dir`}>
                            <Stack direction="row" alignItems={'center'} spacing={.5} sx={{lineHeight:1}}>
                                <Stack direction="row" spacing={0.5} sx={{lineHeight:1}}>
                                    <Typography component="span" sx={{fontSize:'1.7rem',fontWeight:700}}>{journey?.departureName??'--'}({journey?.departure})</Typography>
                                    <i className="iconfont icon-oneway" style={{ fontSize: '2rem' }} />
                                    <Typography component="span" sx={{fontSize:'1.7rem',fontWeight:700}}>{journey?.arrivalName??'--'}({journey?.arrival})</Typography>
                                </Stack>
                                <div className={`${styles.firportSet} cursor-p s-flex ai-ct`} onClick={backTop}>
                                    <BorderColorSharpIcon sx={{fontSize: 14,color: 'var(--active-color)'}} />
                                    <span>{t('order.edit')}</span>
                                </div>
                                <div />
                            </Stack>
                            <Stack direction="row" spacing={1.5}>
                                <Typography component="div" className={'flex ai-fe'}>
                                    {
                                        countAll>1?<PeopleAltIcon sx={{fontSize: 20}} /> : <PersonIcon sx={{fontSize: 20}} />
                                    }
                                    <Typography component="span" sx={{fontSize:'1.2rem',fontWeight:400,lineHeight:1,ml:'5px'}}>{t('order.passengersCount',{count:countAll})}</Typography>
                                </Typography>
                                <Typography component="div" className={'flex ai-fe'}>
                                    <AirlineSeatReclineExtraIcon sx={{fontSize: 20}} />
                                    <Typography component="span" sx={{fontSize:'1.2rem',fontWeight:400,lineHeight:1,ml:'5px'}}>{canbinLabel}</Typography>
                                </Typography>
                                <Typography component="div" className={'flex ai-fe'}>
                                    <CalendarMonthIcon sx={{fontSize: 20}} />
                                    <Typography component="span" sx={{fontSize:'1.2rem',fontWeight:400,lineHeight:1,ml:'5px'}}>{dayjs(journey?.departureDate).format('MMM DD, YYYY')}</Typography>
                                </Typography>
                            </Stack>
                        </div>
                    )
                }

                <div className={styles.chooseDay}>
                    <div style={{maxWidth:'752px'}} className={styles.dayContent}>
                        <DayChoose />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FixHeader
