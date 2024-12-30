import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SearchResult, SearchResults } from "../../interfaces";

interface SearchResultsState {
  searchResults: SearchResults;
  loading: boolean;
  error: string | null;
}

const initialState: SearchResultsState = {
  searchResults: {
    Search: [],
    totalResults: "0",
    Response: "False",
  },
  loading: false,
  error: null,
}

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {
    addResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResults.Search = [...state.searchResults.Search, ...action.payload]
    },
    replaceResults: (state, action: PayloadAction<SearchResults>) => {
      state.searchResults = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  }
})

export const {
  addResults,
  replaceResults,
  setIsLoading,
  setError,
} = searchResultsSlice.actions

export default searchResultsSlice.reducer
