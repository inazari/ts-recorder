import {Action} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "./store";
import {selectDateStart} from "./recorder";

const LOAD_REQUEST = 'userEvents/load_request'
const LOAD_SUCCESS = 'userEvents/load_success'
const LOAD_FAILURE = 'userEvents/load_failure'
const CREATE_REQUEST = 'userEvents/create_request'
const CREATE_SUCCESS = 'userEvent/create_success'
const CREATE_FAILURE = 'userEvent/create_failure'

const initialState: UserEventsState = {
    byIds: {},
    allIds: []
}

export interface UserEvent {
    id: number;
    title: string;
    dateStart: string;
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

interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {
}

interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
    payload: {
        event: UserEvent
    }
}

interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
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

export const createUserEvent = (): ThunkAction<Promise<void>, RootState, undefined, CreateRequestAction | CreateSuccessAction | CreateFailureAction> => (async (dispatch, getState) => {

    dispatch({
        type: CREATE_REQUEST
    })

    try {
        const dateStart = selectDateStart(getState());
        const event: Omit<UserEvent, 'id'> = {
            title: 'No name',
            dateStart,
            dateEnd: new Date().toISOString()
        }

        const response = await fetch(`http://localhost:3004/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })

        const createdEvent: UserEvent = await response.json()

        dispatch({
            type: CREATE_SUCCESS,
            payload: {event: createdEvent}
        })
    } catch (e) {
        dispatch({
            type: CREATE_FAILURE
        })
    }
})

const userEventReducer = (state: UserEventsState = initialState, action: LoadSuccessAction | CreateSuccessAction) => {
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
        case CREATE_SUCCESS:
            const {event} = action.payload
            return {...state, allIds: [...state.allIds, event.id], byIds: {...state.byIds, [event.id] : event}};
        default:
            return state;
    }
}

export default userEventReducer;
