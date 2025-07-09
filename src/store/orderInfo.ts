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
    airportList:[],
    airportActived:0,
    // airChoose:{
    //     result: null,
    //     channelCode:'',
    // },
    airChoose:{
        result: {"contextId":"d3d9954ea889402fa2b2ae08b31ac08b","policies":[],"resultType":"normal","currency":"USD","resultKey":"16817680#181460|181073^16129963#181089|181485","itineraries":[{"amounts":[{"familyName":"VALUE_5","familyCode":"5_ADT9651b5da000656b0VALUE","cabinLevel":"y","nextCodes":["2_ADT79cb07bde1d49269LITE","66_ADT79cb07bde1d49269LITE","162_ADT79cb07bde1d49269LITE","226_ADT79cb07bde1d49269LITE","354_ADT79cb07bde1d49269LITE","418_ADT79cb07bde1d49269LITE"],"passengerType":"adt","minimum":1,"maximum":9,"printAmount":193,"taxesAmount":141.5,"cancelNotes":[],"refundNotes":["More than 24 hrs before departure: AED 400.0 penalty","Less than 24 hrs before departure: 100% penalty","No-show: 100% penalty"],"changeNotes":["More than 24 hrs before departure: AED 150.0 penalty","Less than 24 hrs before departure: 100% penalty","No-show: 100% penalty"],"othersNotes":[],"luggages":[{"luggageType":"checked","luggageCount":30,"luggageNotes":"30kg BAG INCLUDED IN FARE","luggageSizeType":"kg"}],"amountKeys":["R6KMsXE7fovSj4qaJ3pvanX1hFPo60JaLH+bDy9+hjKrLdmc8z5gcSS/knGHLWSizdJ0lb5BeDeqaPr2OLlbBg==","R6KMsXE7fovSj4qaJ3pvanX1hFPo60JaLH+bDy9+hjKrLdmc8z5gcSS/knGHLWSizdJ0lb5BeDeqaPr2OLlbBg=="]},{"familyName":"VALUE_5","familyCode":"5_CHD9651b5da000656b0VALUE","cabinLevel":"y","nextCodes":["2_CHD6258b571400ea54dLITE","66_CHD6258b571400ea54dLITE","162_CHD6258b571400ea54dLITE","226_CHD6258b571400ea54dLITE","354_CHD6258b571400ea54dLITE","418_CHD6258b571400ea54dLITE"],"passengerType":"chd","minimum":1,"maximum":9,"printAmount":193,"taxesAmount":141.5,"cancelNotes":[],"refundNotes":["More than 24 hrs before departure: AED 400.0 penalty","Less than 24 hrs before departure: 100% penalty","No-show: 100% penalty"],"changeNotes":["More than 24 hrs before departure: AED 150.0 penalty","Less than 24 hrs before departure: 100% penalty","No-show: 100% penalty"],"othersNotes":[],"luggages":[{"luggageType":"checked","luggageCount":30,"luggageNotes":"30kg BAG INCLUDED IN FARE","luggageSizeType":"kg"}],"amountKeys":["9e/ltlPQj2XFUOYZ1tZNX7Z/NQtHE5b9TLVcdsjQ03gzrJJblg4ykDR1XE/y1I0SSLsMWkWHUdgk/AwA3EnGiw==","9e/ltlPQj2XFUOYZ1tZNX7Z/NQtHE5b9TLVcdsjQ03gzrJJblg4ykDR1XE/y1I0SSLsMWkWHUdgk/AwA3EnGiw=="]},{"familyName":"VALUE_5","familyCode":"5_INF88c615c8444d15f3VALUE","cabinLevel":"y","nextCodes":["2_INF484981e4ce74ed53LITE","66_INF484981e4ce74ed53LITE","162_INF484981e4ce74ed53LITE","226_INF484981e4ce74ed53LITE","354_INF484981e4ce74ed53LITE","418_INF484981e4ce74ed53LITE"],"passengerType":"inf","minimum":1,"maximum":9,"printAmount":47,"taxesAmount":14,"cancelNotes":[],"refundNotes":["More than 24 hrs before departure: 0% penalty","Less than 24 hrs before departure: 0% penalty","No-show: 0% penalty"],"changeNotes":["More than 24 hrs before departure: 0% penalty","Less than 24 hrs before departure: 0% penalty","No-show: 0% penalty"],"othersNotes":[],"luggages":[{"luggageType":"checked","luggageCount":10,"luggageNotes":"10kg baggage INCLUDED in fare","luggageSizeType":"kg"}],"amountKeys":["51p0Z1hPZCfN3SM+RDq0FmEo1FIO/zsJV/PvS0qD8DljQo+LWcOYxFvmoOikCu+oU99ik4uNc3BT54dViL6gCA==","51p0Z1hPZCfN3SM+RDq0FmEo1FIO/zsJV/PvS0qD8DljQo+LWcOYxFvmoOikCu+oU99ik4uNc3BT54dViL6gCA=="]}],"itineraryNo":0,"itineraryKey":"16817680#181460|181073","segments":[{"isLuggageChecked":null,"sequenceNo":0,"carrier":"FZ","flightNumber":"FZ1134","shareToFlightNo":null,"departureAirport":"KTM","arrivalAirport":"DXB","departureTime":"2025-07-24T09:00:00","arrivalTime":"2025-07-24T12:00:00","departureTerminal":"","arrivalTerminal":"Terminal 3","flightMealType":null,"aircraftModel":"73X","totalFlyingTime":"04:45:00","stops":[],"cabins":[]},{"isLuggageChecked":null,"sequenceNo":1,"carrier":"FZ","flightNumber":"FZ059","shareToFlightNo":null,"departureAirport":"DXB","arrivalAirport":"KWI","departureTime":"2025-07-24T14:25:00","arrivalTime":"2025-07-24T15:20:00","departureTerminal":"Terminal 2","arrivalTerminal":"Terminal 1","flightMealType":null,"aircraftModel":"73D","totalFlyingTime":"01:55:00","stops":[],"cabins":[]}]},{"amounts":[{"familyName":"LITE_2","familyCode":"2_ADT79cb07bde1d49269LITE","cabinLevel":"y","nextCodes":[],"passengerType":"adt","minimum":1,"maximum":9,"printAmount":174,"taxesAmount":92.3,"cancelNotes":[],"refundNotes":["Any time before departure: 100% penalty","No-show: 100% penalty"],"changeNotes":["Any time before departure: 100% penalty","No-show: 100% penalty"],"othersNotes":[],"luggages":[],"amountKeys":["TL6T5TmMtT58lKDoWuH83koD5OEW/dCnQ/09qTleaRmIJi/CsoAXp0KOf5NOPywTS62k00L/wDn1U9L7o5UADg==","TL6T5TmMtT58lKDoWuH83koD5OEW/dCnQ/09qTleaRmIJi/CsoAXp0KOf5NOPywTS62k00L/wDn1U9L7o5UADg=="]},{"familyName":"LITE_2","familyCode":"2_CHD6258b571400ea54dLITE","cabinLevel":"y","nextCodes":[],"passengerType":"chd","minimum":1,"maximum":9,"printAmount":174,"taxesAmount":85.7,"cancelNotes":[],"refundNotes":["Any time before departure: 100% penalty","No-show: 100% penalty"],"changeNotes":["Any time before departure: 100% penalty","No-show: 100% penalty"],"othersNotes":[],"luggages":[],"amountKeys":["UiOHY7sOO7fzxrl7KF1w4bRnvVOCSK9+JR32iRNZ93jjZL1vNtUZsoLF+eNXpsRSfe8T0BrfrO1sn6sr+wwdfA==","UiOHY7sOO7fzxrl7KF1w4bRnvVOCSK9+JR32iRNZ93jjZL1vNtUZsoLF+eNXpsRSfe8T0BrfrO1sn6sr+wwdfA=="]},{"familyName":"LITE_2","familyCode":"2_INF484981e4ce74ed53LITE","cabinLevel":"y","nextCodes":[],"passengerType":"inf","minimum":1,"maximum":9,"printAmount":47,"taxesAmount":11.1,"cancelNotes":[],"refundNotes":["Any time before departure: 0% penalty","No-show: 0% penalty"],"changeNotes":["Any time before departure: 0% penalty","No-show: 0% penalty"],"othersNotes":[],"luggages":[],"amountKeys":["Ywop4wBU/1Tf0iEJx5zW9A0cHjbkBWu8g6UfVAN3JqdqcGbl41CaSeK1GdelblzAbxIkTfbi/9wumufaSVkonA==","Ywop4wBU/1Tf0iEJx5zW9A0cHjbkBWu8g6UfVAN3JqdqcGbl41CaSeK1GdelblzAbxIkTfbi/9wumufaSVkonA=="]}],"itineraryNo":1,"itineraryKey":"16129963#181089|181485","segments":[{"isLuggageChecked":null,"sequenceNo":0,"carrier":"FZ","flightNumber":"FZ058","shareToFlightNo":null,"departureAirport":"KWI","arrivalAirport":"DXB","departureTime":"2025-07-29T20:55:00","arrivalTime":"2025-07-29T23:40:00","departureTerminal":"Terminal 1","arrivalTerminal":"Terminal 2","flightMealType":null,"aircraftModel":"73D","totalFlyingTime":"01:45:00","stops":[],"cabins":[]},{"isLuggageChecked":null,"sequenceNo":1,"carrier":"FZ","flightNumber":"FZ1133","shareToFlightNo":null,"departureAirport":"DXB","arrivalAirport":"KTM","departureTime":"2025-07-30T01:55:00","arrivalTime":"2025-07-30T08:00:00","departureTerminal":"Terminal 3","arrivalTerminal":"","flightMealType":null,"aircraftModel":"73X","totalFlyingTime":"04:20:00","stops":[],"cabins":[]}]}]},
        channelCode:'API-FZ-V1',
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
            console.log(JSON.stringify(state.airChoose.result))

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
