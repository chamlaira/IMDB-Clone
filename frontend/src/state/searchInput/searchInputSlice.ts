import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  searchInput: "",
}

const searchInput = createSlice({
  name: "searchInput",
  initialState,
  reducers: {
    replaceInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload
    }
  },
})

export const { replaceInput } = searchInput.actions

export default searchInput.reducer
