import {Action} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "./store";
import eventsJson from "../jsons/events.json"

const LOAD_REQUEST = 'userEvents/load_request'
const LOAD_SUCCESS = 'userEvents/load_success'
const LOAD_FAILURE = 'userEvents/load_failure'

const initialState: UserEventsState = {
    byIds: {},
    allIds: []
}

export interface UserEvent {
    id: number;
    title: string;
    dataStart: string;
    dateEnd: string;
}

interface UserEventsState {
    byIds: Record<UserEvent['id'], UserEvent>;
    allIds: UserEvent['id'][]
}

const selectUserEventsState = (rootState: RootState) => rootState.userEvents

export const selectUserEventsArray = (rootState: RootState) => {
    const state = selectUserEventsState(rootState)
    return state.allIds.map(id => state.byIds[id])
}

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {
}

interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
    error: string
}

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[]
    }
}


export const loadUserEvent = (): ThunkAction<void, RootState, undefined, LoadRequestAction | LoadSuccessAction | LoadFailureAction> => (async (dispatch, getState) => {
    dispatch({
        type: LOAD_REQUEST
    });
    try {
        const res = await fetch('http://localhost:3004/events');
        const events: UserEvent[] = await res.json();
        console.log(events);
        //const events: UserEvent[] = eventsJson.events
        dispatch({
            type: LOAD_SUCCESS,
            payload: {events}
        });

    } catch (e) {
        dispatch({
            type: LOAD_FAILURE,
            error: 'Failed to load events.'
        })
        console.log(e);
    }
})

const userEventReducer = (state: UserEventsState = initialState, action: LoadSuccessAction) => {
    switch (action.type) {
        case LOAD_SUCCESS:
            const {events} = action.payload
            return {
                ...state,
                allIds: events.map(({id}) => id),
                byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
                    byIds[event.id] = event
                    return byIds
                }, {})
            };
        default:
            return state;
    }
}

export default userEventReducer;
