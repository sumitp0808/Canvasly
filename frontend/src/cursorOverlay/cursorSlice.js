import {createSlice} from '@reduxjs/toolkit';
import {cursorColors} from './constants/cursorColors';

const initialState = {
    cursors: []
};

const cursorSlice = createSlice({
    name: 'cursor',
    initialState,
    reducers: {
        updateCursorPosition: (state, action) => {
            const {x, y, userId, name} = action.payload;

            const index = state.cursors.findIndex((c) => c.userId === userId);

            if(index !== -1){
                state.cursors[index] = {
                    userId,
                    name,
                    x,
                    y,
                    color: state.cursors[index].color,
                };
            } else {
                //assign newColor and add to cursors
                let hash = 0;
                for(let i = 0; i < userId.length; i++){
                    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
                }

                const color = cursorColors[Math.abs(hash) % cursorColors.length];
                state.cursors.push({
                    userId,
                    name,
                    x,
                    y,
                    color,
                });
            }
        },
        removeCursorPosition: (state, action) => {
            state.cursors = state.cursors.filter(c => c.userId !== action.payload);
        },
    },
});

export const {updateCursorPosition, removeCursorPosition} = cursorSlice.actions

export default cursorSlice.reducer