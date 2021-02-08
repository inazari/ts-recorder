import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {RecorderState} from './recorderSlice'

export const selectRecord = (rootState: RootState): RecorderState => rootState.recorder
export const selectDateStart = createSelector(selectRecord, (recorder: RecorderState) => recorder.dateStart);
