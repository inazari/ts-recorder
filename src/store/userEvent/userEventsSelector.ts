import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../redux/store";
import {IUserEventsState} from "./userEventsSlice"

const selectUsersEvent = (rootState: RootState): IUserEventsState => rootState.userEvents

export const selectUserEventsArray = createSelector(selectUsersEvent, (userEvents: IUserEventsState): any => {
    return userEvents.allIds.map(id => userEvents.byIds[id])
});
