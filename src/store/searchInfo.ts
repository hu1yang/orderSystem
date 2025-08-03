import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {CabinLevel, IAirport, ITem, ItineraryType, Travelers} from "@/types/order.ts";
import dayjs from "dayjs";

interface IdaValue{
    arrival: IAirport|null
    departure:IAirport|null
}
interface SearchInfoType {
    travelers:Travelers[]
    cabinValue:CabinLevel
    localDate:{
        to:string
        from:string
    } | string
    radioType:ItineraryType
    daValue:IdaValue
    searchFlag:boolean
    searchLoad:boolean
    errorMsg:string|null
}
const defaultTravelers = [
    { passengerCount: 1, passengerType: 'adt' },
    { passengerCount: 0, passengerType: 'chd' },
    { passengerCount: 0, passengerType: 'inf' },
]
const lcaolDateValue = (isRound:boolean) => {
    if (isRound) {
        const from = dayjs().format('YYYY-MM-DD')
        const to = dayjs().add(1,'day').format('YYYY-MM-DD')
        return { from, to }
    } else {
        const date = dayjs().format('YYYY-MM-DD')
        return date
    }
}

const initialState:SearchInfoType = {
    travelers:defaultTravelers,
    cabinValue:'y',
    localDate: lcaolDateValue(false),
    radioType: 'oneWay',
    daValue:{
        departure:null,
        arrival:null
    },
    searchFlag:false,
    searchLoad:false,
    errorMsg:null
}
const searchInfoSlice = createSlice({
    name:'searchInfo',
    initialState,
    reducers:{
        setRadioType(state,action:PayloadAction<ItineraryType>){
            state.radioType = action.payload;
            state.localDate = lcaolDateValue(action.payload === 'round');
        },
        setLocalDate(state,action:PayloadAction<{
            to:string
            from:string
        } | string>){
            if(typeof action.payload !== 'string'){
                state.localDate = {
                    to:action.payload.to,
                    from:action.payload.from
                };
            }else{
                state.localDate = action.payload;
            }
        },
        setTravelers(state, action: PayloadAction<Travelers>) {
            const { passengerType, passengerCount } = action.payload;
            state.travelers = state.travelers.map(t =>
                t.passengerType === passengerType
                    ? { ...t, passengerCount }
                    : t
            );
        },
        setCabinValue(state,action:PayloadAction<CabinLevel>){
            state.cabinValue = action.payload;
        },
        setDaValue(state,action:PayloadAction<IdaValue>){
            state.daValue = action.payload;
        },
        setHistory(state,action:PayloadAction<ITem>){
            const {cabinLevel,itineraryType,travelers,itineraries} = action.payload
            state.cabinValue = cabinLevel
            state.radioType = itineraryType
            if(itineraryType === 'oneWay'){
                state.localDate = itineraries[0].departureDate
            }else{
                state.localDate = {
                    to: itineraries[1].departureDate,
                    from: itineraries[0].departureDate,
                }
            }

            const newTravelers = defaultTravelers.map((traveler: Travelers) => {
                const matchedTraveler = travelers.find(
                    (t) => t.passengerType === traveler.passengerType
                );

                return {
                    ...traveler,
                    passengerCount: matchedTraveler?.passengerCount ?? 0, // 默认值更安全
                };
            });

            state.travelers = newTravelers
            state.daValue = {
                departure:itineraries[0].departure,
                arrival:itineraries[0].arrival,
            }
        },
        setSearchFlag(state,action:PayloadAction<boolean>){
            state.searchFlag = action.payload;
        },
        setSearchLoad(state,action:PayloadAction<boolean>){
            state.searchLoad = action.payload;
        },
        setErrorMsg(state,action:PayloadAction<string|null>){
            state.errorMsg = action.payload;
        }
    }
})
export const {setRadioType, setLocalDate, setTravelers, setCabinValue, setDaValue, setHistory,setSearchLoad,setErrorMsg,setSearchFlag} = searchInfoSlice.actions
export default searchInfoSlice.reducer;
