import { createContext , useContext } from 'react'
import type {MregeResultData} from "@/types/order.ts";

const SearchDataContext = createContext<null|MregeResultData>(null)

export const SearchDataProvider = SearchDataContext.Provider

export function useSearchData() {
    return useContext(SearchDataContext)
}
