import { useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import {setHistory} from "@/store/searchInfo.ts";

import {useTranslation} from "react-i18next";
import {filterValidTrips, formatDateToShortString, isZhCN} from "@/utils/public.ts";

import {Box, Card, CardActionArea, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import type {ITem} from "@/types/order.ts";

import banner from "@/assets/banner.png";

import styles from './styles.module.less'

const DefaultShow = () => {
    const {t} = useTranslation()
    const dispatch = useDispatch()

    const [historyList, setHistoryList] = useState<ITem[]>([])
    useEffect(() => {
        const historySearch = localStorage.getItem('historySearch')
        const historyResult =  filterValidTrips(historySearch ? JSON.parse(historySearch) : [])
        setHistoryList(historyResult)
        localStorage.setItem('historySearch', JSON.stringify(historyResult));
    }, []);

    const handleSearchHistory = (history:ITem) => {
        dispatch(setHistory(history))
    }

    return (
        <div className={`${styles.defaultShow} full-width`}>
            {
                !!historyList.length && (
                    <Box className={styles.historySection}>
                        <Typography className={styles.historyTitle} variant="h6" component="h2">
                            {t('order.recentSearches')}
                        </Typography>
                        <Grid container spacing={2}>
                            {
                                historyList.map((history,historyIndex) => (
                                    <Grid className={styles.historyGridItem} size={{xs: 12, md: 4}} key={historyIndex}>
                                        <Card className={styles.historyCard}>
                                            <CardActionArea onClick={() => handleSearchHistory(history)} sx={{
                                                height: '100%',
                                                '&[data-active]': {
                                                    backgroundColor: 'action.selected',
                                                    '&:hover': {
                                                        backgroundColor: 'action.selectedHover',
                                                    },
                                                },
                                            }}>
                                                <CardHeader className={styles.historyHeader} title={
                                                    `${history.itineraries[0].departure[isZhCN?'cityCName':'cityEName']}(${history.itineraries[0].departure.airportCode}) - ${history.itineraries[0].arrival[isZhCN?'cityCName':'cityEName']}(${history.itineraries[0].arrival.airportCode})`
                                                } subheader={
                                                    formatDateToShortString(history.itineraries[0].departureDate)
                                                } action={<KeyboardArrowRightIcon fontSize="large" />} />
                                                <CardContent className={styles.historyContent}>
                                                    <div className={`${styles.historyMeta} flex jc-bt ai-ct`}>
                                                        <Typography sx={{ color: 'text.secondary' }}>
                                                            {t('order.passengersCount',{count:history.travelers?.reduce((total, t) => total + (t.passengerCount || 0), 0)})}
                                                        </Typography>
                                                        <Typography sx={{ color: 'text.secondary' }}>
                                                            {t(`order.${history.itineraryType}`)}
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                            </CardActionArea>

                                        </Card>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                )
            }

            <img className={styles.defaultBanner} src={banner} alt="" />
        </div>
    )
}

export default DefaultShow
