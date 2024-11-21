import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  initialState: {
    currentUser: null,
  },
  name: "user",
  reducers: {
    SetCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});


export const { SetCurrentUser } = userSlice.actions;