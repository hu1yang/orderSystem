import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    AirChoose,
    FQuery,
    FQueryResult, IContact,
    ItineraryType, Passenger,
    ResponseData,
    ResponseItinerary,
    Result,
    Travelers
} from '@/types/order'
import dayjs from "dayjs";

type IOrder = {
    query: FQuery
    airportList: ResponseData[]
    airportActived: number
    airChoose: AirChoose
    passengers: Passenger[]
    selectPassengers: string[]
    contacts: IContact[]
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
    query:{"itineraryType":"round","cabinLevel":"y","travelers":[{"passengerCount":1,"passengerType":"adt"},{"passengerCount":0,"passengerType":"chd"},{"passengerCount":0,"passengerType":"inf"}],"itineraries":[{"itineraryNo":0,"arrival":"CAN","departure":"TAS","departureDate":"2025-07-11"},{"itineraryNo":1,"arrival":"TAS","departure":"CAN","departureDate":"2025-07-12"}]},
    airportList:[
        {
            "channelCode":"API-C6-V1",
            "updatedTime":"2025-07-07T11:52:16.4119708+08:00",
            "isFromCaching":true,
            "results":[
                {
                    "contextId":"e136796a2c4447209baef113895ae4ac",
                    "policies":[ ],
                    "resultType":"normal",
                    "currency":"USD",
                    "resultKey":"API-C6-V1",
                    "itineraries":[
                        {
                            "amounts":[
                                {
                                    "familyName":"Base",
                                    "familyCode":"P1|V|VRT",
                                    "cabinLevel":"y",
                                    "nextCodes":['P4|V3|TASDX_V3'],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":10,
                                    "printAmount":156,
                                    "taxesAmount":29.48,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[ ],
                                    "amountKeys":[
                                        "76uWyooj0e2RAadifyYXZZGufd6f1QQ5fz+xenlGIPPmv/r9cOteg5YZvwukLoL/",
                                        "76uWyooj0e2RAadifyYXZZGufd6f1QQ5fz+xenlGIPPmv/r9cOteg5YZvwukLoL/"
                                    ]
                                },
                                {
                                    "familyName":"Optimal",
                                    "familyCode":"P3|V2|DX_V2",
                                    "cabinLevel":"y",
                                    "nextCodes":[ ],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":20,
                                    "printAmount":253,
                                    "taxesAmount":29.48,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[
                                        {
                                            "luggageType":"carry",
                                            "luggageCount":32,
                                            "luggageNotes":"C6651",
                                            "luggageSizeType":"kg"
                                        }
                                    ],
                                    "amountKeys":[
                                        "nvXCFPgnuyLD3Bu6v8HaI047nRmSAM05pOr7xw2+qKuxzK4777MVYlboG9jmxDal",
                                        "nvXCFPgnuyLD3Bu6v8HaI047nRmSAM05pOr7xw2+qKuxzK4777MVYlboG9jmxDal"
                                    ]
                                },
                                {
                                    "familyName":"Comfort",
                                    "familyCode":"P4|V3|TASDX_V3",
                                    "cabinLevel":"y",
                                    "nextCodes":[ ],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":30,
                                    "printAmount":303,
                                    "taxesAmount":29.48,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[
                                        {
                                            "luggageType":"carry",
                                            "luggageCount":32,
                                            "luggageNotes":"C6651",
                                            "luggageSizeType":"kg"
                                        }
                                    ],
                                    "amountKeys":[
                                        "G8SQ/II+QecSubTJJFAlCTFj9mkkOena6cQqfw4iPmLLxrK4/y2bP+HtY67AW5A1",
                                        "G8SQ/II+QecSubTJJFAlCTFj9mkkOena6cQqfw4iPmLLxrK4/y2bP+HtY67AW5A1"
                                    ]
                                }
                            ],
                            "itineraryNo":0,
                            "itineraryKey":"TASCANC66512025-07-11",
                            "segments":[
                                {
                                    "isLuggageChecked":false,
                                    "sequenceNo":0,
                                    "carrier":"C6",
                                    "flightNumber":"C6651",
                                    "shareToFlightNo":"",
                                    "departureAirport":"TAS",
                                    "arrivalAirport":"CAN",
                                    "departureTime":"2025-07-11T14:35:00",
                                    "arrivalTime":"2025-07-11T22:50:00",
                                    "departureTerminal":"",
                                    "arrivalTerminal":"",
                                    "flightMealType":"",
                                    "aircraftModel":"A21N",
                                    "totalFlyingTime":"05:15:00",
                                    "stops":[ ],
                                    "cabins":[
                                        {
                                            "cabinLevel":"y",
                                            "quantity":10,
                                            "cabinName":"VRT",
                                            "cabinInfo":"461",
                                            "cabinCode":"V"
                                        },
                                        {
                                            "cabinLevel":"y",
                                            "quantity":20,
                                            "cabinName":"DX_V2",
                                            "cabinInfo":"461",
                                            "cabinCode":"V2"
                                        },
                                        {
                                            "cabinLevel":"y",
                                            "quantity":30,
                                            "cabinName":"TASDX_V3",
                                            "cabinInfo":"461",
                                            "cabinCode":"V3"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "amounts":[
                                {
                                    "familyName":"Base",
                                    "familyCode":"P1|V|VRT",
                                    "cabinLevel":"y",
                                    "nextCodes":[ ],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":10,
                                    "printAmount":156,
                                    "taxesAmount":0,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[ ],
                                    "amountKeys":[
                                        "76uWyooj0e2RAadifyYXZfqGHF6DSq3vZlT240gkF28=",
                                        "76uWyooj0e2RAadifyYXZfqGHF6DSq3vZlT240gkF28="
                                    ]
                                },
                                {
                                    "familyName":"Optimal",
                                    "familyCode":"P3|V2|DX_V2",
                                    "cabinLevel":"y",
                                    "nextCodes":[ ],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":20,
                                    "printAmount":253,
                                    "taxesAmount":0,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[
                                        {
                                            "luggageType":"carry",
                                            "luggageCount":32,
                                            "luggageNotes":"C6650",
                                            "luggageSizeType":"kg"
                                        }
                                    ],
                                    "amountKeys":[
                                        "nvXCFPgnuyLD3Bu6v8HaI047nRmSAM05pOr7xw2+qKtHzvOZPg3MWAz48VRcDJ0g",
                                        "nvXCFPgnuyLD3Bu6v8HaI047nRmSAM05pOr7xw2+qKtHzvOZPg3MWAz48VRcDJ0g"
                                    ]
                                },
                                {
                                    "familyName":"Comfort",
                                    "familyCode":"P4|V3|TASDX_V3",
                                    "cabinLevel":"y",
                                    "nextCodes":[ ],
                                    "passengerType":"adt",
                                    "minimum":1,
                                    "maximum":30,
                                    "printAmount":303,
                                    "taxesAmount":0,
                                    "cancelNotes":[ ],
                                    "refundNotes":[ ],
                                    "changeNotes":[ ],
                                    "othersNotes":[ ],
                                    "luggages":[
                                        {
                                            "luggageType":"carry",
                                            "luggageCount":32,
                                            "luggageNotes":"C6650",
                                            "luggageSizeType":"kg"
                                        }
                                    ],
                                    "amountKeys":[
                                        "G8SQ/II+QecSubTJJFAlCTFj9mkkOena6cQqfw4iPmJciN6sds7ksqH+bAICrY98",
                                        "G8SQ/II+QecSubTJJFAlCTFj9mkkOena6cQqfw4iPmJciN6sds7ksqH+bAICrY98"
                                    ]
                                }
                            ],
                            "itineraryNo":1,
                            "itineraryKey":"CANTASC66502025-07-12",
                            "segments":[
                                {
                                    "isLuggageChecked":false,
                                    "sequenceNo":0,
                                    "carrier":"C6",
                                    "flightNumber":"C6650",
                                    "shareToFlightNo":"",
                                    "departureAirport":"CAN",
                                    "arrivalAirport":"TAS",
                                    "departureTime":"2025-07-12T00:35:00",
                                    "arrivalTime":"2025-07-12T02:50:00",
                                    "departureTerminal":"",
                                    "arrivalTerminal":"",
                                    "flightMealType":"",
                                    "aircraftModel":"A21N",
                                    "totalFlyingTime":"05:15:00",
                                    "stops":[ ],
                                    "cabins":[
                                        {
                                            "cabinLevel":"y",
                                            "quantity":10,
                                            "cabinName":"VRT",
                                            "cabinInfo":"461",
                                            "cabinCode":"V"
                                        },
                                        {
                                            "cabinLevel":"y",
                                            "quantity":20,
                                            "cabinName":"DX_V2",
                                            "cabinInfo":"461",
                                            "cabinCode":"V2"
                                        },
                                        {
                                            "cabinLevel":"y",
                                            "quantity":30,
                                            "cabinName":"TASDX_V3",
                                            "cabinInfo":"461",
                                            "cabinCode":"V3"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    // airportList:[],
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
        },
        setPassenger: (state, action: PayloadAction<Passenger>) => {
            state.passengers.push(action.payload);
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
        }
    },
})


export const { setQuery , setAirportList ,setQueryType , setQueryValue , setTravelers , setChannelCode , setResult , updateItineraries, setQueryDate , setResultItineraries , setPassenger , setSelectPassengers , setContacts , prevAirChoose } = orderInfoSlice.actions
export default orderInfoSlice.reducer
