import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    AirChoose, AirSearchData,
    FQuery,
    FQueryResult, IContact,
    ItineraryType, Passenger,
    ResponseItinerary,
    Result,
    Travelers
} from '@/types/order'
import dayjs from "dayjs";
import {setSearchDateFnc} from "@/utils/order.ts";

type IOrder = {
    query: FQuery
    airportActived: number
    airChoose: AirChoose
    passengers: Passenger[]
    selectPassengers: string[]
    contacts: IContact[]
    airSearchData: AirSearchData[]
}
const initialState: IOrder = {
    // query:{
    //     itineraryType: 'oneWay',
    //     cabinLevel: 'y',
    //     travelers: [
    //         { passengerCount: 1, passengerType: 'adt' },
    //         { passengerCount: 0, passengerType: 'chd' },
    //         { passengerCount: 0, passengerType: 'inf' },
    //     ],
    //     itineraries: [
    //         {
    //             itineraryNo: 0,
    //             arrival: '',
    //             departureDate: '',
    //             departure: '',
    //         },
    //     ],
    // },
    query:{
        itineraryType: 'round',
        cabinLevel: 'y',
        travelers: [
            { passengerCount: 1, passengerType: 'adt' },
            { passengerCount: 1, passengerType: 'chd' },
            { passengerCount: 1, passengerType: 'inf' },
        ],
        itineraries: [
            {
                itineraryNo: 0,
                arrival: 'KWI',
                departureDate: '2025-07-24',
                departure: 'KTM',
            },
            {
                itineraryNo: 1,
                arrival: 'KTM',
                departureDate: '2025-07-29',
                departure: 'KWI',
            },
        ],
    },
    airSearchData:[],
    airportActived:0,
    airChoose:{
        result: null,
        channelCode:'',
    },
    passengers:[],
    selectPassengers:[],
    contacts:[
        {
            contactName:'',
            emailAddress:'',
            phoneNumber: '',
        }
    ]
}

const orderInfoSlice = createSlice({
    name: 'orderInfo',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<FQuery>) => {
            state.query = action.payload
        },
        setQueryValue: <K extends keyof FQuery>(
            state: IOrder,
            action: PayloadAction<{ name: K; values: FQuery[K] }>
        ) => {
            state.query[action.payload.name] = action.payload.values
        },
        setQueryType: (state, action: PayloadAction<ItineraryType>) => {
            const itinerarie = state.query.itineraries[0]
            switch (action.payload) {
                case 'oneWay':
                    state.query.itineraries = [{...itinerarie}]
                    break
                case 'round':
                    state.query.itineraries = [
                        {...itinerarie},
                        {
                            itineraryNo: 1,
                            arrival: itinerarie.departure,
                            departureDate: dayjs(itinerarie.departureDate).add(1, 'day').format('YYYY-MM-DD'),
                            departure: itinerarie.arrival,
                        },
                    ]
                    break
            }
            state.query.itineraryType = action.payload
        },
        setTravelers: (state, action: PayloadAction<Travelers>) => {
            const {passengerType, passengerCount} = action.payload
            const index = state.query.travelers.findIndex(t => t.passengerType === passengerType)
            if (index !== -1) {
                state.query.travelers[index].passengerCount = passengerCount
            }
        },
        setQueryDate: (state, action: PayloadAction<string[]>) => {
            const newItineraries = [...state.query.itineraries]

            switch (state.query.itineraryType) {
                case 'oneWay':
                    newItineraries[0].departureDate = action.payload[0]
                    break
                case 'round':
                    newItineraries[0].departureDate = action.payload[0]
                    newItineraries[1].departureDate = action.payload[1]
                    break
                case 'multi':
                    break

            }
            state.query.itineraries = newItineraries;
        },
        updateItineraries: (state,action: PayloadAction<string[]>) => {
            state.query = {
                ...state.query,
                itineraries:state.query.itineraries.map((itinerarie,itinerarieIndex) => ({
                    ...itinerarie,
                    departureDate: action.payload[itinerarieIndex]
                }))
            }
        },
        setChannelCode: (state,action: PayloadAction<string>) => {
            state.airChoose.channelCode = action.payload
        },
        setResult: (state, action: PayloadAction<Result|null>) => {
            state.airChoose.result = action.payload;
            if(action.payload && state.query.itineraries.length > state.airportActived + 1){
                state.airportActived += 1;
            }
        },
        setResultItineraries: (state, action: PayloadAction<ResponseItinerary>) => {
            if (!state.airChoose.result) return;

            if (!Array.isArray(state.airChoose.result.itineraries)) {
                state.airChoose.result.itineraries = [];
            }

            if (state.query.itineraries.length > state.airChoose.result.itineraries.length) {
                state.airChoose.result.itineraries.push(action.payload);
            }
        },
        setPassenger: (state, action: PayloadAction<{passenger:Passenger,index:number}>) => {
            const {passenger,index} = action.payload
            if(index !== -1) {
                state.passengers.splice(index, 1,passenger)
                return
            }
            state.passengers.push(passenger);
        },
        setSelectPassengers: (state, action: PayloadAction<string>) => {
            const prev = state.selectPassengers;
            const idNumber = action.payload
            state.selectPassengers =  prev.includes(idNumber)
                ? prev.filter(id => id !== idNumber)
                : [...prev, idNumber]
        },
        setContacts: (state, action: PayloadAction<IContact>) => {
            state.contacts = [{...action.payload}];
        },
        prevAirChoose: (state) => {
            if(state.airportActived === 1){
                state.airChoose.channelCode = ''
                state.airportActived = 0
                state.airChoose.result = null
            }else{
                if (state.airChoose.result) {
                    state.airChoose.result.itineraries = state.airChoose.result.itineraries.slice(0, state.airportActived + 1);
                }
                state.airportActived = state.airportActived - 1
            }
        },
        setSearchDate: (state, action: PayloadAction<FQueryResult[]>) => {
            const result = setSearchDateFnc(action.payload)
            state.airSearchData = result;
        },
    },
})


export const {
    setQuery,
    setQueryType,
    setQueryValue,
    setTravelers,
    setChannelCode,
    setResult,
    updateItineraries,
    setQueryDate,
    setResultItineraries,
    setPassenger,
    setSelectPassengers,
    setContacts,
    prevAirChoose,
    setSearchDate
} = orderInfoSlice.actions
export default orderInfoSlice.reducer
