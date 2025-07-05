import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    AirChoose,
    FQuery,
    FQueryResult,
    ItineraryType,
    ResponseData,
    ResponseItinerary,
    Result,
    Travelers
} from '@/types/order'
import dayjs from "dayjs";
import type {RootState} from "@/store/index.ts";

type IOrder = {
    query:FQuery
    airportList:ResponseData[],
    airportActived:number
    airChoose:AirChoose
}
const initialState: IOrder = {
    // query:{
    //     itineraryType: 'oneWay',
    //     cabinLevel: 'y',
    //     travelers: [
    //         { passengerCount: 2, passengerType: 'adt' },
    //         { passengerCount: 2, passengerType: 'chd' },
    //         { passengerCount: 2, passengerType: 'inf' },
    //     ],
    //     itineraries: [
    //         {
    //             itineraryNo: 0,
    //             arrival: 'TAS',
    //             departureDate: dayjs().format('YYYY-MM-DD'),
    //             departure: 'CAN',
    //         },
    //     ],
    // },
    query:{
        itineraryType: 'round',
        cabinLevel: 'y',
        travelers: [
            { passengerCount: 2, passengerType: 'adt' },
            { passengerCount: 2, passengerType: 'chd' },
            { passengerCount: 2, passengerType: 'inf' },
        ],
        itineraries: [
            {
                itineraryNo: 0,
                arrival: 'TAS',
                departureDate: '2025-07-11',
                departure: 'CAN',
            },
            {
                itineraryNo: 1,
                arrival: 'CAN',
                departureDate: '2025-07-12',
                departure: 'TAS',
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
        setAirportList: (state, action: PayloadAction<FQueryResult[]>) => {
            state.airportList = action.payload.flatMap(li =>
                li.succeed ? [li.response] : []
            );
        },
        setChannelCode: (state,action: PayloadAction<string>) => {
            state.airChoose.channelCode = action.payload
        },
        setResult: (state, action: PayloadAction<Result|null>) => {
            state.airChoose.result = action.payload;
            if(action.payload && state.query.travelers.length > state.airportActived + 1){
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
        }
    },
})

export const selectTotalPrice = (state: RootState) => {
    const resultAir = state.ordersInfo.airChoose.result;
    if (!resultAir?.itineraries) return 0;

    return resultAir.itineraries.reduce((total, itinerary) => {
        const itineraryTotal = itinerary.amounts.reduce((sum, amount) => {
            return sum + amount.printAmount + amount.taxesAmount;
        }, 0);
        return total + itineraryTotal;
    }, 0);
};

export const { setAirportList ,setQueryType , setQueryValue , setTravelers , setChannelCode , setResult , updateItineraries, setQueryDate , setResultItineraries } = orderInfoSlice.actions
export default orderInfoSlice.reducer
