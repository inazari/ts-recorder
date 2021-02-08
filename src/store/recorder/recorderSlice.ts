import {createSlice} from '@reduxjs/toolkit';

export interface RecorderState {
    dateStart: string
}

const initialState: RecorderState = {
    dateStart: ''
}

const recorderSlice = createSlice({
    name: 'recorder',
    initialState,
    reducers: {
        start: (state): RecorderState => ({
            ...state,
            dateStart: new Date().toISOString()
        }),
        stop: (state) => ({
            ...state,
            dateStart: ''
        })
    }
})

export const {
    start,
    stop
} = recorderSlice.actions;

export default recorderSlice.reducer;
