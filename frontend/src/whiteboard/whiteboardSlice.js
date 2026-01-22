import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tool: null,
  elements: [],
  strokeColor: "#000000", //default color black
  strokeWidth: 3,         //default stroke width
  history: [],            //undo stack
  redoStack: [],          //redo stack
};

const whiteBoardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    //tool reducer
    setToolType: (state, action) => {
      state.tool = action.payload;
    },

    //drawing element reducers
    updateElement: (state, action) => {
      const {id} = action.payload;

      const index = state.elements.findIndex(element => element.id === id);

      if(index === -1){
        state.elements.push(action.payload);
      }else{
        state.elements[index] = action.payload;
      }
    },
    setElements: (state, action) => {
      state.elements = action.payload;
    },

    //color reducers
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
    },

    //strokeWidth reducer
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload;
    },

    //history reducers(for undo-redo)
    pushToHistory: (state) => {
      state.history.push(JSON.stringify(state.elements));
      state.redoStack = []; // clearing redo on new action
    },
    undo: (state) => {
      if (state.history.length === 0) return;
      state.redoStack.push(JSON.stringify(state.elements));
      const prev = state.history.pop();
      state.elements = JSON.parse(prev);
    },
    redo: (state) => {
      if (state.redoStack.length === 0) return;
      state.history.push(JSON.stringify(state.elements));
      const next = state.redoStack.pop();
      state.elements = JSON.parse(next);
    },
  },
}); 

export const {setToolType, updateElement, setElements, setStrokeColor, setStrokeWidth, pushToHistory, undo, redo} = whiteBoardSlice.actions;
export default whiteBoardSlice.reducer;