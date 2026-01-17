import { configureStore } from '@reduxjs/toolkit';
import whiteBoardSliceReducer from '../whiteboard/whiteboardSlice'
import cursorSliceReducer from '../cursorOverlay/cursorSlice'

export const store = configureStore({
  reducer: {
    whiteboard: whiteBoardSliceReducer,
    cursor: cursorSliceReducer,
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
