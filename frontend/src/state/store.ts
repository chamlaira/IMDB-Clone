import { configureStore } from "@reduxjs/toolkit"

import searchResultsReducer from "./searchResults/searchResultsSlice"
import searchInputReducer from "./searchInput/searchInputSlice";

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    searchInput: searchInputReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
