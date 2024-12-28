import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Movie } from "../../interfaces"

interface InitialState {
  viewedMovies: Movie[]
}

const initialState: InitialState = {
  viewedMovies: [],
}

const viewedMovies = createSlice({
  name: "viewedMovies",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      if (state.viewedMovies.find(movie => movie.imdbID === action.payload.imdbID)) return
      state.viewedMovies = [...state.viewedMovies, action.payload]
    },
  },
})

export const { addMovie } = viewedMovies.actions

export default viewedMovies.reducer
