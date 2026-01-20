import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  avatar: "",
  roomId: "",
  userId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearUser: () => initialState,
  },
});

export const { setUser, setUserId, clearUser } = userSlice.actions;
export default userSlice.reducer;
