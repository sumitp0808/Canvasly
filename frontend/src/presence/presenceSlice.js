import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], // { userId, name, avatar }
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    userJoined: (state, action) => {
      const exists = state.users.find(
        u => u.userId === action.payload.userId
      );
      if (!exists) state.users.push(action.payload);
    },
    userLeft: (state, action) => {
      state.users = state.users.filter(
        u => u.userId !== action.payload
      );
    },
    resetPresence: (state) => {
      state.users = [];
    },
  },
});

export const { userJoined, userLeft, resetPresence } = presenceSlice.actions;
export default presenceSlice.reducer;
