import axios from "../createRequest.ts";
import type {
    AirChooseForm,
    CommonResponseGroup, CommonResponseOrder,
    FQuery,
    FQueryResult,
    FQueryResultForm,
    OrderCreate
} from "@/types/order.ts";

export const getAuthorizableRoutingGroupAgent = (form:FQuery)  => axios.post<FQueryResult[],FQuery>('/agentApi/Service/FlightQuery',form)

export const queryBookingAgent = (form:AirChooseForm) => axios.post<FQueryResultForm,AirChooseForm>('/agentApi/Service/QueryBooking',form)

export const orderCreateAgent = (form:OrderCreate) => axios.post<CommonResponseOrder,OrderCreate>('/agentApi/Service/OrderCreate',form)


export const paymentOrderAgent = (id:string) => axios.patch<CommonResponseGroup>(`/agentApi/Orders/PaymentOrder/${id}`)

export const getIdentityAgent = () => axios.get('/identityApi/AgentAccount/GetIdentity')
