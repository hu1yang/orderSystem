import axios from "../createRequest.ts";
import type {AirChooseForm, FQuery, FQueryResult} from "@/types/order.ts";

export const getAuthorizableRoutingGroupAgent = (form:FQuery)  => axios.get<FQueryResult,FQuery>('/agentApi/Service/FlightQuery',form)

export const queryBookingAgent = (form:AirChooseForm) => axios.get<AirChooseForm,AirChooseForm>('/agentApi/Service/QueryBooking',form)
