import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tool: null,
  elements: [],
  strokeColor: "#000000", //default color black
};

const whiteBoardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
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
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload;
    },
  },
}); 

export const {setToolType, updateElement, setElements, setStrokeColor} = whiteBoardSlice.actions;
export default whiteBoardSlice.reducer;