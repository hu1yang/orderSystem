import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {AirChoose, FQuery, ResponseData, Result, Travelers} from '@/types/order'

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
            { passengerCount: 5, passengerType: 'adt' },
            { passengerCount: 1, passengerType: 'chd' },
            { passengerCount: 0, passengerType: 'inf' },
        ],
        itineraries: [
            {
                itineraryNo: 0,
                arrival: 'TAS',
                departureDate: '2025-07-04',
                departure: 'CAN',
            },
        ],
    },
    airportList:[
        {
            "channelCode": "API-C6-V1",
            "updatedTime": "2025-06-28T16:39:34.4835258+08:00",
            "isFromCaching": true,
            "results": [
                {
                    "contextId": "b547d081c803464da9d5f6273492dc21",
                    "policies": [],
                    "resultType": "normal",
                    "currency": "USD",
                    "resultKey": "API-C6-V1",
                    "itineraries": [
                        {
                            "amounts": [
                                {
                                    "familyName": "Base",
                                    "familyCode": "P1|X|TASDX_X",
                                    "cabinLevel": "y",
                                    "nextCodes": [],
                                    "passengerType": "adt",
                                    "minimum": 1,
                                    "maximum": 39,
                                    "printAmount": 903,
                                    "taxesAmount": 0,
                                    "cancelNotes": [],
                                    "refundNotes": [],
                                    "changeNotes": [],
                                    "othersNotes": [],
                                    "luggages": [
                                        {
                                            "luggageType": "carry",
                                            "luggageCount": 23,
                                            "luggageNotes": "C6650",
                                            "luggageSizeType": "kg"
                                        }
                                    ],
                                    "amountKeys": [
                                        "vYAypSQz1TpiYS8bwtWrnGTY2+0x3i2IgxzEBwvopJEdx4+Osu87b7w3I3uhz4z6",
                                        "vYAypSQz1TpiYS8bwtWrnGTY2+0x3i2IgxzEBwvopJEdx4+Osu87b7w3I3uhz4z6"
                                    ]
                                },
                                {
                                    "familyName": "Optimal",
                                    "familyCode": "P3|S2|DX_S2",
                                    "cabinLevel": "y",
                                    "nextCodes": [],
                                    "passengerType": "adt",
                                    "minimum": 1,
                                    "maximum": 215,
                                    "printAmount": 806,
                                    "taxesAmount": 0,
                                    "cancelNotes": [],
                                    "refundNotes": [],
                                    "changeNotes": [],
                                    "othersNotes": [],
                                    "luggages": [
                                        {
                                            "luggageType": "carry",
                                            "luggageCount": 23,
                                            "luggageNotes": "C6650",
                                            "luggageSizeType": "kg"
                                        }
                                    ],
                                    "amountKeys": [
                                        "1Bex8FbAfFmUNIn1J9QjZmyK2OPfE9tf1f5FuUrQd+CJwz2q37DL3J/CaKfcdZJw",
                                        "1Bex8FbAfFmUNIn1J9QjZmyK2OPfE9tf1f5FuUrQd+CJwz2q37DL3J/CaKfcdZJw"
                                    ]
                                },
                                {
                                    "familyName": "Comfort",
                                    "familyCode": "P4|S3|Domes_S3",
                                    "cabinLevel": "y",
                                    "nextCodes": [],
                                    "passengerType": "adt",
                                    "minimum": 1,
                                    "maximum": 215,
                                    "printAmount": 852,
                                    "taxesAmount": 0,
                                    "cancelNotes": [],
                                    "refundNotes": [],
                                    "changeNotes": [],
                                    "othersNotes": [],
                                    "luggages": [
                                        {
                                            "luggageType": "carry",
                                            "luggageCount": 23,
                                            "luggageNotes": "C6650",
                                            "luggageSizeType": "kg"
                                        }
                                    ],
                                    "amountKeys": [
                                        "E5lSzegIKD+m0Bikgdsz+Oi7GbhW5+q1zAe/9wWc8VWNRogOjBxGKN9Nh2g5zLdD",
                                        "E5lSzegIKD+m0Bikgdsz+Oi7GbhW5+q1zAe/9wWc8VWNRogOjBxGKN9Nh2g5zLdD"
                                    ]
                                }
                            ],
                            "itineraryNo": 0,
                            "itineraryKey": "CANTASC66502025-07-04",
                            "segments": [
                                {
                                    "isLuggageChecked": false,
                                    "sequenceNo": 0,
                                    "carrier": "C6",
                                    "flightNumber": "C6650",
                                    "shareToFlightNo": "",
                                    "departureAirport": "CAN",
                                    "arrivalAirport": "TAS",
                                    "departureTime": "2025-07-04T00:35:00",
                                    "arrivalTime": "2025-07-04T02:50:00",
                                    "departureTerminal": "",
                                    "arrivalTerminal": "",
                                    "flightMealType": "",
                                    "aircraftModel": "A21N",
                                    "totalFlyingTime": "05:15:00",
                                    "stops": [],
                                    "cabins": [
                                        {
                                            "cabinLevel": "y",
                                            "quantity": 215,
                                            "cabinName": "Domes_S3",
                                            "cabinInfo": "461",
                                            "cabinCode": "S3"
                                        },
                                        {
                                            "cabinLevel": "y",
                                            "quantity": 39,
                                            "cabinName": "TASDX_X",
                                            "cabinInfo": "461",
                                            "cabinCode": "X"
                                        },
                                        {
                                            "cabinLevel": "y",
                                            "quantity": 215,
                                            "cabinName": "DX_S2",
                                            "cabinInfo": "461",
                                            "cabinCode": "S2"
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
    airportActived:0,
    // airChoose:{
    //     result: null,
    //     channelCode:'',
    // }
    airChoose:{
        channelCode:'',
        result:{"contextId":"b547d081c803464da9d5f6273492dc21","policies":[],"resultType":"normal","currency":"USD","resultKey":"API-C6-V1","itineraries":[{"amounts":[{"familyName":"Comfort","familyCode":"P4|S3|Domes_S3","cabinLevel":"y","nextCodes":[],"passengerType":"adt","minimum":1,"maximum":215,"printAmount":852,"taxesAmount":0,"cancelNotes":[],"refundNotes":[],"changeNotes":[],"othersNotes":[],"luggages":[{"luggageType":"carry","luggageCount":23,"luggageNotes":"C6650","luggageSizeType":"kg"}],"amountKeys":["E5lSzegIKD+m0Bikgdsz+Oi7GbhW5+q1zAe/9wWc8VWNRogOjBxGKN9Nh2g5zLdD","E5lSzegIKD+m0Bikgdsz+Oi7GbhW5+q1zAe/9wWc8VWNRogOjBxGKN9Nh2g5zLdD"]}],"itineraryNo":0,"segments":[{"isLuggageChecked":false,"sequenceNo":0,"carrier":"C6","flightNumber":"C6650","shareToFlightNo":"","departureAirport":"CAN","arrivalAirport":"TAS","departureTime":"2025-07-04T00:35:00","arrivalTime":"2025-07-04T02:50:00","departureTerminal":"","arrivalTerminal":"","flightMealType":"","aircraftModel":"A21N","totalFlyingTime":"05:15:00","stops":[],"cabins":[{"cabinLevel":"y","quantity":215,"cabinName":"Domes_S3","cabinInfo":"461","cabinCode":"S3"},{"cabinLevel":"y","quantity":39,"cabinName":"TASDX_X","cabinInfo":"461","cabinCode":"X"},{"cabinLevel":"y","quantity":215,"cabinName":"DX_S2","cabinInfo":"461","cabinCode":"S2"}]}]}]}
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
        setAirportList: (state, action: PayloadAction<ResponseData[]>) => {
            state.airportList = action.payload
        },
        setChannelCode: (state,action: PayloadAction<string>) => {
            state.airChoose.channelCode = action.payload
        },
        setResult: (state, action: PayloadAction<Result|null>) => {
            if(!action.payload) {
                state.airChoose.result = null
            }
            state.airChoose.result = action.payload
        }
    },
})

export const { setAirportList , setQueryValue , setTravelers , setChannelCode , setResult } = orderInfoSlice.actions
export default orderInfoSlice.reducer
