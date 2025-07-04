// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import orderInfoReducer from './orderInfo.ts'

export const store = configureStore({
    reducer: {
        ordersInfo: orderInfoReducer,
    },
    devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
