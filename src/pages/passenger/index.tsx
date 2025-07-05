import styles from './styles.module.less'
import {Step, StepLabel, Stepper, Typography} from "@mui/material";
import Detail from "@/component/passenger/detail.tsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {queryBookingAgent} from "@/utils/request/agetn.ts";
import {setResult} from "@/store/orderInfo.ts";

const Passenger = () => {
    const state = useSelector((state: RootState) => state.ordersInfo)
    const dispatch = useDispatch()

    useEffect(() => {
        // sendResult()
        dispatch(setResult({
            "contextId": "55ee363ea9054b218b8687bd18ed6580",
            "policies": [],
            "resultType": "normal",
            "currency": "USD",
            "resultKey": "API-C6-V1",
            "itineraries": [
                {
                    "amounts": [
                        {
                            "familyName": "Optimal",
                            "familyCode": "P3|S2|DX_S2",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "adt",
                            "minimum": 1,
                            "maximum": 215,
                            "printAmount": 810,
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
                                "1Bex8FbAfFmUNIn1J9QjZmyK2OPfE9tf1f5FuUrQd+DMXvELI85wgmIUe4+AxoUd",
                                "1Bex8FbAfFmUNIn1J9QjZmyK2OPfE9tf1f5FuUrQd+DMXvELI85wgmIUe4+AxoUd"
                            ]
                        },
                        {
                            "familyName": "Optimal",
                            "familyCode": "P3|S2|DX_S2",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "chd",
                            "minimum": 1,
                            "maximum": 215,
                            "printAmount": 608,
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
                                "1Bex8FbAfFmUNIn1J9QjZmvnswAfzQL9zfZSBdQbNQfJmfMUm1p2kCIMAnZm6f35",
                                "1Bex8FbAfFmUNIn1J9QjZmvnswAfzQL9zfZSBdQbNQfJmfMUm1p2kCIMAnZm6f35"
                            ]
                        },
                        {
                            "familyName": "Optimal",
                            "familyCode": "P3|S2|DX_S2",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "inf",
                            "minimum": 1,
                            "maximum": 215,
                            "printAmount": 81,
                            "taxesAmount": 0,
                            "cancelNotes": [],
                            "refundNotes": [],
                            "changeNotes": [],
                            "othersNotes": [],
                            "luggages": [
                                {
                                    "luggageType": "carry",
                                    "luggageCount": 10,
                                    "luggageNotes": "C6650",
                                    "luggageSizeType": "kg"
                                }
                            ],
                            "amountKeys": [
                                "1Bex8FbAfFmUNIn1J9QjZpb1nvBk7ogA67cSn91/ln2qhii37KgqV3SSoCx/WZNL",
                                "1Bex8FbAfFmUNIn1J9QjZpb1nvBk7ogA67cSn91/ln2qhii37KgqV3SSoCx/WZNL"
                            ]
                        }
                    ],
                    "itineraryNo": 0,
                    "itineraryKey": "CANTASC66502025-07-11",
                    "segments": [
                        {
                            "isLuggageChecked": false,
                            "sequenceNo": 0,
                            "carrier": "C6",
                            "flightNumber": "C6650",
                            "shareToFlightNo": "",
                            "departureAirport": "CAN",
                            "arrivalAirport": "TAS",
                            "departureTime": "2025-07-11T00:35:00",
                            "arrivalTime": "2025-07-11T02:50:00",
                            "departureTerminal": "",
                            "arrivalTerminal": "",
                            "flightMealType": "",
                            "aircraftModel": "A21N",
                            "totalFlyingTime": "05:15:00",
                            "stops": [],
                            "cabins": [
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
                                },
                                {
                                    "cabinLevel": "y",
                                    "quantity": 215,
                                    "cabinName": "Domes_S3",
                                    "cabinInfo": "461",
                                    "cabinCode": "S3"
                                }
                            ]
                        }
                    ]
                },
                {
                    "amounts": [
                        {
                            "familyName": "Base",
                            "familyCode": "P1|V|VOW",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "adt",
                            "minimum": 1,
                            "maximum": 10,
                            "printAmount": 173,
                            "taxesAmount": 29.48,
                            "cancelNotes": [],
                            "refundNotes": [],
                            "changeNotes": [],
                            "othersNotes": [],
                            "luggages": [],
                            "amountKeys": [
                                "lYcNgxVm1hEvMu0ypqKyx2g+F03mjXBP9TJg9jdlmPqqwe7hs/a5oXWtaC1Coouw",
                                "lYcNgxVm1hEvMu0ypqKyx2g+F03mjXBP9TJg9jdlmPqqwe7hs/a5oXWtaC1Coouw"
                            ]
                        },
                        {
                            "familyName": "Base",
                            "familyCode": "P1|V|VOW",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "chd",
                            "minimum": 1,
                            "maximum": 10,
                            "printAmount": 173,
                            "taxesAmount": 29.48,
                            "cancelNotes": [],
                            "refundNotes": [],
                            "changeNotes": [],
                            "othersNotes": [],
                            "luggages": [],
                            "amountKeys": [
                                "A9LiXwaL8rhII9E3Xe1CIEIkBW9sOoXk1zte1vKuTgJHkBwlnbhFAZmbubUw5Y4X",
                                "A9LiXwaL8rhII9E3Xe1CIEIkBW9sOoXk1zte1vKuTgJHkBwlnbhFAZmbubUw5Y4X"
                            ]
                        },
                        {
                            "familyName": "Base",
                            "familyCode": "P1|V|VOW",
                            "cabinLevel": "y",
                            "nextCodes": [],
                            "passengerType": "inf",
                            "minimum": 1,
                            "maximum": 10,
                            "printAmount": 173,
                            "taxesAmount": 0,
                            "cancelNotes": [],
                            "refundNotes": [],
                            "changeNotes": [],
                            "othersNotes": [],
                            "luggages": [],
                            "amountKeys": [
                                "4u33wOzLXPXWpb599SssdIdWW93VUKP5LX72f96j4TA=",
                                "4u33wOzLXPXWpb599SssdIdWW93VUKP5LX72f96j4TA="
                            ]
                        }
                    ],
                    "itineraryNo": 1,
                    "itineraryKey": "TASCANC66512025-07-12",
                    "segments": [
                        {
                            "isLuggageChecked": false,
                            "sequenceNo": 0,
                            "carrier": "C6",
                            "flightNumber": "C6651",
                            "shareToFlightNo": "",
                            "departureAirport": "TAS",
                            "arrivalAirport": "CAN",
                            "departureTime": "2025-07-12T14:35:00",
                            "arrivalTime": "2025-07-12T22:50:00",
                            "departureTerminal": "",
                            "arrivalTerminal": "",
                            "flightMealType": "",
                            "aircraftModel": "A21N",
                            "totalFlyingTime": "05:15:00",
                            "stops": [],
                            "cabins": [
                                {
                                    "cabinLevel": "y",
                                    "quantity": 10,
                                    "cabinName": "VOW",
                                    "cabinInfo": "461",
                                    "cabinCode": "V"
                                },
                                {
                                    "cabinLevel": "y",
                                    "quantity": 20,
                                    "cabinName": "DX_V2",
                                    "cabinInfo": "461",
                                    "cabinCode": "V2"
                                },
                                {
                                    "cabinLevel": "y",
                                    "quantity": 30,
                                    "cabinName": "TASDX_V3",
                                    "cabinInfo": "461",
                                    "cabinCode": "V3"
                                }
                            ]
                        }
                    ]
                }
            ]
        }))

    },[])

    const sendResult = () => {
        const newTravelers = state.query.travelers.filter(traveler => traveler.passengerCount>0)
        queryBookingAgent({
            ...state.airChoose,
            request:{
                ...state.query,
                travelers:newTravelers
            }
        }).then(res => {
            if(res.succeed){
                dispatch(setResult(res.response))
            }
        })
    }
    return (
        <div className={styles.passengerLayout}>
            <Detail />
        </div>
    )
}

export default Passenger;
