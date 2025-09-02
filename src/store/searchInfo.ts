import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {CabinLevel, IAirport, ITem, ItineraryType, Travelers} from "@/types/order.ts";
import dayjs from "dayjs";

interface IdaValue{
    arrival: IAirport|null
    departure:IAirport|null
}
interface SearchInfoType {
    travelers:Travelers[]
    cabinValue:CabinLevel
    radioType:ItineraryType
    searchQuery:{
        daValue:IdaValue
        localDate:{
            to:string
            from:string
        } | string | null
    }[]
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
    searchQuery:[
        {
            localDate: lcaolDateValue(false),
            daValue:{
                departure:null,
                arrival:null
            },
        }
    ],
    radioType: 'oneWay',
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
            if(action.payload === 'multi'){
                state.searchQuery = [
                    {
                        ...state.searchQuery[0],
                        localDate: lcaolDateValue(false),
                    },
                    {
                        localDate: null,
                        daValue:{
                            departure:null,
                            arrival:null
                        },
                    }
                ]
            }else{
                state.searchQuery = [
                    {
                        localDate:lcaolDateValue(action.payload === 'round'),
                        daValue:state.searchQuery[0].daValue,
                    }
                ]
            }
        },
        setLocalDate(
            state,
            action: PayloadAction<{
                timer: { to: string; from: string } | string
                index: number
            }>
        ) {
            const { timer, index } = action.payload

            if (typeof timer !== 'string') {
                state.radioType = 'round'
                state.searchQuery[index].localDate = timer
            } else {
                state.searchQuery[index].localDate = timer

                if (state.radioType === 'multi') {
                    state.searchQuery.forEach((item, itemIndex) => {
                        if (
                            itemIndex > index &&
                            item.localDate &&
                            dayjs(item.localDate as string).isBefore(dayjs(timer)) // ✅ 小于 timer
                        ) {
                            item.localDate = null // ✅ 设置为 null
                        }
                    })
                }
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
        setDaValue(state,action:PayloadAction<{
            value:IdaValue
            index:number
        }>){
            const {value,index} = action.payload;
            state.searchQuery[index].daValue = value;
        },
        addSearch(state) {
            state.searchQuery.push({
                localDate: null,
                daValue: {
                    departure: null,
                    arrival: null
                },
            });
        },
        delSearch(state, action: PayloadAction<number>) {
            state.searchQuery.splice(action.payload, 1)
        },
        setHistory(state, action: PayloadAction<ITem>) {
            const { cabinLevel, itineraryType, travelers, itineraries } = action.payload;

            // 更新舱位和行程类型
            state.cabinValue = cabinLevel;
            state.radioType = itineraryType;

            // 更新 searchQuery
            if (itineraryType === 'multi') {
                state.searchQuery = itineraries.map(itin => ({
                    localDate: itin.departureDate,
                    daValue: {
                        departure: itin.departure,
                        arrival: itin.arrival
                    }
                }));
            } else {
                // 确保 searchQuery 至少有一条
                if (!state.searchQuery[0]) {
                    state.searchQuery[0] = {
                        localDate: null,
                        daValue: { departure: null, arrival: null }
                    };
                }

                const firstItin = itineraries[0];
                const secondItin = itineraries[1];

                state.searchQuery[0].daValue = {
                    departure: firstItin.departure,
                    arrival: firstItin.arrival
                };

                state.searchQuery[0].localDate =
                    itineraryType === 'oneWay'
                        ? firstItin.departureDate
                        : { from: firstItin.departureDate, to: secondItin?.departureDate ?? firstItin.departureDate };
            }

            // 更新 travelers
            state.travelers = defaultTravelers.map(defaultT => {
                const matched = travelers.find(t => t.passengerType === defaultT.passengerType);
                return { ...defaultT, passengerCount: matched?.passengerCount ?? 0 };
            });
        },
        setSearchFlag(state,action:PayloadAction<boolean>){
            state.searchFlag = action.payload;
        },
        setSearchLoad(state,action:PayloadAction<boolean>){
            state.searchLoad = action.payload;
        },
        setErrorMsg(state,action:PayloadAction<string|null>){
            state.errorMsg = action.payload;
        },
        resetSearch: () => initialState
    }
})
export const {
    setRadioType,
    setLocalDate,
    setTravelers,
    setCabinValue,
    setDaValue,
    setHistory,
    setSearchLoad,
    setErrorMsg,
    setSearchFlag,
    addSearch,
    delSearch,
    resetSearch
} = searchInfoSlice.actions
export default searchInfoSlice.reducer;
