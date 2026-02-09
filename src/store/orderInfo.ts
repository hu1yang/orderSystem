import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    AirChoose,
    FQuery,
    IContact,
    MregeResultAirport, Passenger, QueryAirport,
    ResponseItinerary,
    Result,
} from '@/types/order'

type IOrder = {
    query: FQuery
    airportActived: number
    airChoose: AirChoose
    passengers: Passenger[]
    contacts: IContact[]
    airSearchData: MregeResultAirport[]
    disabledChoose:boolean
    cityList: QueryAirport[]
    createdLoading:boolean
    filterData:{
        airline:string[]
        filterTime:{
            departure:number[]
            arrival:number[]
        }[]
    }
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
                arrival: '',
                departureDate: '',
                departure: '',
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
    contacts:[
        {
            contactName:'',
            emailAddress:'',
            phoneNumber: '',
        }
    ],
    disabledChoose:false,
    cityList: [],
    createdLoading:false,
    filterData:{
        airline:[],
        filterTime:[]
    }
}

const orderInfoSlice = createSlice({
    name: 'orderInfo',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<FQuery>) => {
            state.query = action.payload
        },
        setChannelCode: (state,action: PayloadAction<string>) => {
            state.airChoose.channelCode = action.payload
            if(!action.payload){
                state.airportActived = 0
            }
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
        setPassengers: (state, action: PayloadAction<Passenger[]>) => {
            state.passengers = action.payload
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
        setSearchDate: (state, action: PayloadAction<MregeResultAirport[]>) => {
            if(action.payload.length){
                const result = action.payload
                state.airSearchData.push(...result)

                state.filterData = {
                    ...state.filterData,
                    airline:[
                        ...state.filterData.airline,
                        action.payload[0]?.channelCode
                    ]
                }
            }
        },
        resetSearchDate: (state) => {
            state.airSearchData = [];
        },
        resetAirChoose:(state) => {
            state.airportActived = 0
            state.airChoose = {
                result: null,
                channelCode:'',
            }
        },
        switchDay:(state, action: PayloadAction<{
            to:string
            from:string
        } | string>) => {
            if(state.query.itineraryType === 'oneWay'){
                state.query.itineraries = state.query.itineraries.map(it => ({
                    ...it,
                    departureDate: action.payload as string
                }));
            }else if (state.query.itineraryType === 'round'){
                state.query.itineraries.forEach(it => {
                    if(it.itineraryNo === 0){
                        it.departureDate = (action.payload as { to:string; from:string }).from
                    }else{
                        it.departureDate = (action.payload as { to:string; from:string }).to
                    }
                });

            }
        },
        setDisabledChoose(state, action: PayloadAction<boolean>) {
            state.disabledChoose = action.payload
        },
        setCityArr(state, action: PayloadAction<QueryAirport[]>) {
            state.cityList = action.payload
        },
        setCreatedLoading(state, action: PayloadAction<boolean>) {
            state.createdLoading = action.payload
        },
        setFilterData(state, action: PayloadAction<{
            airline?: string[]
            filterTime?: {
                departure:number[]
                arrival:number[]
            }[]
        }>) {
            state.filterData = {
                airline:action.payload.airline ?? state.filterData.airline,
                filterTime:action.payload.filterTime ?? state.filterData.filterTime,
            }
        },
        setFilterDataFilterTime(state, action: PayloadAction<{
            departure:number[]
            arrival:number[]
        }[]>) {
            state.filterData = {
                ...state.filterData,
                filterTime:action.payload
            }
        },
        resetChoose: () => initialState
    },
})


export const {
    setQuery,
    setChannelCode,
    setResult,
    setResultItineraries,
    setPassengers,
    setContacts,
    resetAirChoose,
    prevAirChoose,
    setSearchDate,
    resetChoose,
    switchDay,
    setDisabledChoose,
    setCityArr,
    setCreatedLoading,
    setFilterData,
    setFilterDataFilterTime,
    resetSearchDate,
} = orderInfoSlice.actions
export default orderInfoSlice.reducer
