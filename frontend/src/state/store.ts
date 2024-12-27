import { configureStore } from "@reduxjs/toolkit"

import searchResultsReducer from "./searchResults/searchResultsSlice"

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
