import { configureStore } from "@reduxjs/toolkit"

import searchResultsReducer from "./searchResults/searchResultsSlice"
import searchInputReducer from "./searchInput/searchInputSlice";
import viewedMoviesReducer from "./viewedMovies/viewedMoviesSlice";

export const store = configureStore({
  reducer: {
    searchResults: searchResultsReducer,
    searchInput: searchInputReducer,
    viewedMovies: viewedMoviesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
