import { configureStore } from '@reduxjs/toolkit';
import whiteBoardSliceReducer from '../whiteboard/whiteboardSlice'
import cursorSliceReducer from '../cursorOverlay/cursorSlice'
import userSliceReducer from './userSlice'
import presenceSliceReducer from '../presence/presenceSlice'
import chatSliceReducer from '../chat/chatSlice'
import authSliceReducer from '../auth/authSlice'

export const store = configureStore({
  reducer: {
    whiteboard: whiteBoardSliceReducer,
    cursor: cursorSliceReducer,
    user: userSliceReducer,
    presence: presenceSliceReducer,
    chat: chatSliceReducer,
    auth: authSliceReducer,
  },
  middleware : (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          "whiteboard/setElements",
          "whiteboard/updateElement"
        ],
        ignorePaths: [
          "whiteboard.elements",
        ],
      },
    }),
});
