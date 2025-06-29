import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {AirChoose, FQuery, FQueryResult, ResponseData, Result, Travelers} from '@/types/order'
import dayjs from "dayjs";
import {queryBookingAgent} from "@/utils/request/agetn.ts";

type IOrder = {
    query:FQuery
    airportList:ResponseData[],
    airportActived:number
    airChoose:AirChoose
}
const initialState: IOrder = {
    query:{
        itineraryType: 'oneWay',
        cabinLevel: 'y',
        travelers: [
            { passengerCount: 1, passengerType: 'adt' },
            { passengerCount: 0, passengerType: 'chd' },
            { passengerCount: 0, passengerType: 'inf' },
        ],
        itineraries: [
            {
                itineraryNo: 0,
                arrival: 'TAS',
                departureDate: dayjs().format('YYYY-MM-DD'),
                departure: 'CAN',
            },
        ],
    },
    airportList:[],
    airportActived:0,
    airChoose:{
        result: null,
        channelCode:'',
    }
}

const orderInfoSlice = createSlice({
    name: 'orderInfo',
    initialState,
    reducers: {
        setQueryValue: <K extends keyof FQuery>(
            state: IOrder,
            action: PayloadAction<{ name: K; values: FQuery[K] }>
        ) => {
            state.query[action.payload.name] = action.payload.values
        },
        setTravelers: (state, action: PayloadAction<Travelers>) => {
            const {passengerType, passengerCount} = action.payload
            const index = state.query.travelers.findIndex(t => t.passengerType === passengerType)
            if (index !== -1) {
                state.query.travelers[index].passengerCount = passengerCount
            }
        },
        setAirportList: (state, action: PayloadAction<FQueryResult[]>) => {
            state.airportList = action.payload.flatMap(li =>
                li.succeed ? [li.response] : []
            );
        },
        setChannelCode: (state,action: PayloadAction<string>) => {
            state.airChoose.channelCode = action.payload
        },
        setResult: (state, action: PayloadAction<Result|null>) => {
            if(!action.payload) {
                state.airChoose.result = null
            }
            state.airChoose.result = action.payload
            const newTravelers = state.query.travelers.filter(traveler => traveler.passengerCount>0)
            queryBookingAgent({
                ...state.airChoose,
                request:{
                    ...state.query,
                    travelers:newTravelers
                }
            }).then(res => {
                if(res.succeed){
                    state.airChoose = {
                        ...state.airChoose,
                        result: res.response,
                    }
                }
            })

        },
        updateItineraries: (state,action: PayloadAction<string[]>) => {
            state.query = {
                ...state.query,
                itineraries:state.query.itineraries.map((itinerarie,itinerarieIndex) => ({
                    ...itinerarie,
                    departureDate: action.payload[itinerarieIndex]
                }))
            }
            console.log(state.query)
        }
    },
})

export const { setAirportList , setQueryValue , setTravelers , setChannelCode , setResult , updateItineraries } = orderInfoSlice.actions
export default orderInfoSlice.reducer
