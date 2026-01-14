import axios from "../createRequest.ts";
import type {
    AgentSetting,
    AirChooseForm,
    CommonResponseGroup, CommonResponseOrder,
    FQuery,
    FQueryResult,
    FQueryResultForm,
    OrderCreate, QueryAirport, QueryGlobalAirports
} from "@/types/order.ts";

export const flightQueryAgent = (form:FQuery)  => axios.post<FQueryResult[],FQuery>('/agentApi/Service/FlightQuery',form)
export const queryGlobalAirportsAgent = (form:string[])  => axios.post<QueryAirport[],string[]>('/agentApi/Configs/QueryGlobalAirports',form)

export const queryBookingAgent = (form:AirChooseForm) => axios.post<FQueryResultForm,AirChooseForm>('/agentApi/Service/QueryBooking',form)

export const orderCreateAgent = (form:OrderCreate) => axios.post<CommonResponseOrder,OrderCreate>('/agentApi/Service/OrderCreate',form)


export const paymentOrderAgent = (id:string) => axios.patch<CommonResponseGroup>(`/agentApi/Orders/PaymentOrder/${id}`)

export const getIdentityAgent = () => axios.get('/identityApi/AgentAccount/GetIdentity')

export const fuzzyQueryGlobalAirportsAgent = (content:string) => axios.get<QueryGlobalAirports[]>(`/agentApi/Configs/FuzzyQueryGlobalAirports/${content}/20`)

export const getAgentSettingAgent = () => axios.get<AgentSetting>(`/agentApi/Configs/GetAgentSetting`)
