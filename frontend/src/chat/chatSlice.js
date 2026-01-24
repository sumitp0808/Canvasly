import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], //{id, message, user, timestamp}
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
