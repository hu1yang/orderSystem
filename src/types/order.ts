import type {Dayjs} from "dayjs";
import PriceDetail from "@/component/order/priceDetail.tsx";

export type ItineraryType = 'oneWay'| 'round'| 'multi'
export type CabinLevel = 'y'| 'c'| 'f'
export type PassengerType =  'adt'| 'chd'| 'inf'
export type LuggageType = 'carry'| 'hand'| 'checked'
export type LuggageSizeType = 'pc'| 'kg'| 'lb'
export type ResultType = 'normal'|'teamed'
export type ISourceType = 'manual'| 'webApi'| 'import'
export type ChangedType = 'income'|'outlay'|unknown; // 如有更多类型可在此扩展
export type PaymentType = 'createTicket'| 'refundTicket'| 'changeTicket'| 'teamPayments'| 'teamRetracts'| 'assistIncome'| 'assistOutlay'| 'queryLimited'| 'queryReturns'| 'otherReasons'|unknown; // 如有固定枚举建议列出

export interface PriceSum {
    printAmount: number;
    taxesAmount: number;
}
type IPassengerIdType =  'pp'| 'ni'| 'bd' | unknown
type ITravelerSex = 'm'| 'f'| null | unknown
interface ExpandsSetting {
    indexId: string;
    value: string;
    name: string;
}
export interface Travelers {
    passengerCount: number
    passengerType: string
}
export interface Itineraries {
    itineraryNo: number
    arrival: string
    departureDate: string
    departure: string
}

export interface Luggage {
    luggageType: LuggageType;
    luggageCount: number|string;
    luggageNotes: string;
    luggageSizeType: LuggageSizeType;
}
export interface Amount {
    familyName: string;
    familyCode: string;
    cabinLevel: CabinLevel;
    nextCodes: string[];
    passengerType: PassengerType;
    minimum: number|string;
    maximum: number|string;
    printAmount: number;
    taxesAmount: number;
    cancelNotes: string[];
    refundNotes: string[];
    changeNotes: string[];
    othersNotes: string[];
    luggages: Luggage[];
    amountKeys?: string[];
}
export interface StopInfo {
    stopTime: string|number;
    stopAirport: string;
}

export interface Cabin {
    cabinLevel: string;
    quantity: number|null;
    cabinName: string|null;
    cabinInfo: string|null;
    cabinCode: string;
}
export interface Segment {
    isLuggageChecked: boolean|null;
    sequenceNo: number|null;
    carrier: string;
    flightNumber: string;
    shareToFlightNo: string|null;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    departureTerminal: string|null;
    arrivalTerminal: string|null;
    flightMealType: string|null;
    aircraftModel: string|null;
    totalFlyingTime: string|null;
    stops: StopInfo[];
    cabins: Cabin[];
}
export interface ResponseItinerary {
    amounts: Amount[];
    itineraryNo?: number|null;
    subItineraryId?: string|null;
    itineraryKey: string;
    segments: Segment[];
}

export interface Result {
    contextId: string
    policies: string[] // 如果需要可再细化
    resultType: ResultType
    currency: string
    resultKey: string
    itineraries: ResponseItinerary[]
}

export interface ResponseData {
    channelCode: string
    updatedTime: string
    isFromCaching: boolean
    results: Result[]
}


export interface FQuery{
    itineraryType:ItineraryType
    cabinLevel:CabinLevel
    travelers: Travelers[]
    itineraries:Itineraries[]
}
export interface FQueryResult {
    succeed: boolean
    errorCode: string | null
    errorMessage: string | null
    response: ResponseData
}

export type FQueryResultForm = Omit<FQueryResult, 'response'> & {
    response: Result
}

export interface AirChoose{
    result: Result | null
    channelCode: string
}

export type AirChooseForm = AirChoose & {
    request:FQuery
}


export type OrderCreate = AirChooseForm & {
    shuttleNumber: string
    tLimit: string
    remarks: string
    passengers: Passenger[]
    contacts: IContact[]
}


export interface Passenger {
    title: string|null
    fullName: string
    idNumber: string
    idCountry: string
    trCountry: string
    issuedDate: null|Dayjs
    birthday: null|Dayjs
    expiryDate: null|Dayjs
    phoneNumber: string
    emailAddress: string
    passengerIdType: IPassengerIdType
    passengerType: PassengerType
    passengerSexType: ITravelerSex
}

export interface IContact {
    contactName:string
    phoneNumber: string|null
    emailAddress: string
}



export interface IResponse{
    currency: string,
    sourceRate: number,
    exchangeRate: number
    targetRate: number
    printAmount: number
    taxesAmount: number
    orderNumber: string
}
export interface CommonResponseOrder {
    succeed: boolean
    errorCode: string
    errorMessage: string
    response: IResponse
}
export interface BookingHistory {
    paymentAccountId: string
    bookingPaymentId: string
}
export interface BookingPayment {
    id: string
    branchId: string
    accountName: string
    bookingNumber: string
    transactionId: string
    balance: number
    currency: string
    totalAmount: number
    exchangeRate: number
    changedType: ChangedType
    paymentType: PaymentType
    remarks: string
    operator: string
    creator: string
    bookingHistory: BookingHistory
    updatedTime: string // ISO 格式时间
    createdTime: string // ISO 格式时间
}
export interface GroupBalance{
    id: string;
    branchId: string;
    agentId: string;
    isLocked:boolean;
    currency:'USD';
    balance:string|number;
    operator: string;
    updatedTime: string;
    createdTime: string;
    expandSettings: ExpandsSetting[];
}
export interface IContent {
    beforeBalance: number
    currentBalance: number
    agentAccountId: string
    tradePaymentId: string
    agentAccount: GroupBalance
    tradePayment: Omit<BookingPayment, 'accountName'|'bookingNumber'|'balance'|'bookingHistory'>&{
        agentId: string
        orderNumber: string
        reconciled: boolean
        sourceType:ISourceType;
        tradeHistory: string
    }
    time: string
}
export interface CommonResponseGroup {
    succeed: boolean;
    message: string;
    content?: null|string|IContent
}

export type PriceDetail = {
    printAmount: number;
    taxesAmount: number;
    unitPrice: number;
    totalPrice: number;
    count: number;
};

export type PriceSummary = {
    totalPrice: number;
    perType: Record<PassengerType, PriceDetail>;
};
