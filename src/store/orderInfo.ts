import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
    AirChoose, AirSearchData,
    FQuery,
    FQueryResult, IContact,
    ItineraryType, Passenger,
    ResponseData,
    ResponseItinerary,
    Result, Segment,
    Travelers
} from '@/types/order'
import dayjs from "dayjs";
import {applyNextCodeFilter, findLowestAdultCombo} from "@/utils/price.ts";

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
        },
        setSearchDate: (state, action: PayloadAction<FQueryResult[]>) => {
            const originalData = action.payload.flatMap(li => li.succeed ? [li.response] : []);

            const zeroMap = new Map<string, {
                key: string,
                contexts: { base: ResponseItinerary, original: ResponseData, result: Result }[]
            }>();

            const getFlightKey = (segments: Segment[]) => {
                return segments.map(seg => `${seg.flightNumber}-${seg.departureAirport}-${seg.arrivalAirport}`).join('|');
            };

            originalData.forEach(original => {
                original.results.forEach(result => {
                    const zeros = result.itineraries.filter(it => it.itineraryNo === 0);

                    zeros.forEach(zero => {
                        const flightKey = getFlightKey(zero.segments || []);

                        if (!zeroMap.has(flightKey)) {
                            zeroMap.set(flightKey, {
                                key: flightKey,
                                contexts: []
                            });
                        }

                        zeroMap.get(flightKey)!.contexts.push({
                            base: zero, // ✅ 每个 context 拥有自己的 base
                            original,
                            result
                        });
                    });
                });
            });

            const groupedResults = Array.from(zeroMap.values()).map(({ key, contexts }) => {
                const combinationResult = contexts.map(({ base, original, result }) => {
                    const others = result.itineraries.filter((it:ResponseItinerary) => it.itineraryNo !== 0);
                    const filteredOthers = others.map((it:ResponseItinerary) => {
                        if (it.itineraryNo !== 1) return it;

                        const filteredAmounts = (it.amounts || []).filter(a => a.passengerType === 'adt');

                        return {
                            ...it,
                            amounts: filteredAmounts
                        };
                    });


                    return {
                        channelCode: original.channelCode,
                        resultType: result.resultType,
                        policies: result.policies,
                        contextId: result.contextId,
                        resultKey: result.resultKey,
                        currency: result.currency,
                        itineraries: [{...base}, ...filteredOthers]
                    };
                });


                const cheapest = findLowestAdultCombo(
                    combinationResult.map(r => {
                        const base = r.itineraries.find(i => i.itineraryNo === 0)!;
                        const nextCodes = base.amounts?.[0]?.nextCodes || [];

                        return applyNextCodeFilter(r.itineraries, nextCodes);
                    })
                );


                return {
                    combinationKey: key,
                    combinationResult,
                    cheapAmount: cheapest
                };
            });

            state.airSearchData = groupedResults;
        }
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
