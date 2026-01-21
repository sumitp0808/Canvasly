import { configureStore } from '@reduxjs/toolkit';
import whiteBoardSliceReducer from '../whiteboard/whiteboardSlice'
import cursorSliceReducer from '../cursorOverlay/cursorSlice'
import userSliceReducer from './userSlice'
import presenceSliceReducer from '../presence/presenceSlice'
import chatSliceReducer from '../chat/chatSlice'

export const store = configureStore({
  reducer: {
    whiteboard: whiteBoardSliceReducer,
    cursor: cursorSliceReducer,
    user: userSliceReducer,
    presence: presenceSliceReducer,
    chat: chatSliceReducer,
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
