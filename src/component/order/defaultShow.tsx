import {Box, Card, CardActionArea, CardContent, CardHeader, Grid, Typography} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {memo, useEffect, useState} from "react";
import type {ITem} from "@/types/order.ts";
import {filterValidTrips, formatDateToShortString} from "@/utils/public.ts";
import {useDispatch} from "react-redux";
import {setHistory} from "@/store/searchInfo.ts";
import banner from "@/assets/banner.png";
const DefaultShow = memo(() => {
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
        <div className={'full-width'}>
            {
                !!historyList.length && (
                    <Box>
                        <Typography variant="h6" component="h2" style={{
                            marginBottom: '1rem',
                        }}>
                            Recent Searches
                        </Typography>
                        <Grid container spacing={2}>
                            {
                                historyList.map((history,historyIndex) => (
                                    <Grid size={4} key={historyIndex}>
                                        <Card>
                                            <CardActionArea onClick={() => handleSearchHistory(history)} sx={{
                                                height: '100%',
                                                '&[data-active]': {
                                                    backgroundColor: 'action.selected',
                                                    '&:hover': {
                                                        backgroundColor: 'action.selectedHover',
                                                    },
                                                },
                                            }}>
                                                <CardHeader title={
                                                    `${history.itineraries[0].departure.cityEName}(${history.itineraries[0].departure.airportCode}) - ${history.itineraries[0].arrival.cityEName}(${history.itineraries[0].arrival.airportCode})`
                                                } subheader={
                                                    formatDateToShortString(history.itineraries[0].departureDate)
                                                } action={<KeyboardArrowRightIcon fontSize="large" />} />
                                                <CardContent>
                                                    <div className={'flex jc-bt ai-ct'}>
                                                        <Typography sx={{ color: 'text.secondary' }}>
                                                            {history.travelers?.reduce((total, t) => total + (t.passengerCount || 0), 0)} Passenger
                                                        </Typography>
                                                        <Typography sx={{ color: 'text.secondary' }}>
                                                            {history.itineraryType}
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

            <img src={banner} alt="" style={{width:'100%',marginTop:'var(--pm-16)'}} />
        </div>
    )
})

export default DefaultShow
