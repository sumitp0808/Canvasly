import { configureStore } from '@reduxjs/toolkit';
import whiteBoardSliceReducer from '../whiteboard/whiteboardSlice'

export const store = configureStore({
  reducer: {
    whiteboard: whiteBoardSliceReducer,
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
