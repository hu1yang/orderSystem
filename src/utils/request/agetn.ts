import axios from "../createRequest.ts";
import type {AirChooseForm, CommonResponseGroup, FQuery, FQueryResult, OrderCreate} from "@/types/order.ts";

export const getAuthorizableRoutingGroupAgent = (form:FQuery)  => axios.post<FQueryResult,FQuery>('/agentApi/Service/FlightQuery',form)

export const queryBookingAgent = (form:AirChooseForm) => axios.post<AirChooseForm,AirChooseForm>('/agentApi/Service/QueryBooking',form)

export const orderCreateAgent = (form:OrderCreate) => axios.post<CommonResponseGroup,OrderCreate>('/agentApi/Service/OrderCreate',form)
