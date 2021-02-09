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

const DELETE_REQUEST = 'userEvents/delete_request'
const DELETE_SUCCESS = 'userEvent/delete_success'
const DELETE_FAILURE = 'userEvent/delete_failure'

const UPDATE_REQUEST = 'userEvent/update_request'
const UPDATE_SUCCESS = 'userEvent/update_success'
const UPDATE_FAILURE = 'userEvent/update_failure'

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


interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {
}

interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
    payload: {
        event: UserEvent
    }
}

interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
}

interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {
}

interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
    payload: {
        id: UserEvent['id']
    }
}

interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
}

export const loadUserEvent = (): ThunkAction<void, RootState, undefined, LoadRequestAction | LoadSuccessAction | LoadFailureAction> => (async (dispatch) => {
    dispatch({
        type: LOAD_REQUEST
    });
    try {
        const res = await fetch('http://localhost:3004/events');
        const events: UserEvent[] = await res.json();

        dispatch({
            type: LOAD_SUCCESS,
            payload: {events}
        });

    } catch (e) {
        dispatch({
            type: LOAD_FAILURE,
            error: 'Failed to load events.'
        })
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


export const updateUserEvent = (userEvent: UserEvent): ThunkAction<Promise<void>, RootState, undefined, UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction> => async dispatch => {
    dispatch({
        type: UPDATE_REQUEST
    })


    try {
        const {id} = userEvent;
        const response = await fetch(`http://localhost:3004/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userEvent)
        })

        const updatedEvent = await response.json();

        dispatch({
            type: UPDATE_SUCCESS,
            payload: {event: updatedEvent}
        })


    } catch (e) {
        dispatch({
            type: UPDATE_FAILURE
        })
    }


}

export const deleteUserEvent = (id: UserEvent['id']): ThunkAction<Promise<void>, RootState, undefined, DeleteSuccessAction | DeleteRequestAction | DeleteFailureAction> => async dispatch => {
    dispatch({
        type: DELETE_REQUEST
    })

    try {
        const response = await fetch(`http://localhost:3004/events/${id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            dispatch({
                type: DELETE_SUCCESS,
                payload: {id}
            })
        }
    } catch (e) {
        dispatch({
            type: DELETE_FAILURE
        })
    }
}


function loadSuccessReducer(state: UserEventsState, action: LoadSuccessAction) {
    const {events} = action.payload
    return {
        ...state,
        allIds: events.map(({id}) => id),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
            byIds[event.id] = event
            return byIds
        }, {})
    };
}

function updateSuccessReducer(state: UserEventsState, action: UpdateSuccessAction) {
    const {event} = action.payload
    return {...state, byIds: {...state.byIds, [event.id]: event}};
}

function deleteSuccessReducer(state: UserEventsState, action: DeleteSuccessAction) {
    const {id} = action.payload
    const newState = {
        ...state,
        byIds: {...state.byIds},
        allIds: state.allIds.filter((soredId => soredId !== id))
    }
    delete newState.byIds[id]
    return newState
}

function createSuccessReducer(state: UserEventsState, action: CreateSuccessAction) {
    const {event} = action.payload
    return {...state, allIds: [...state.allIds, event.id], byIds: {...state.byIds, [event.id]: event}};
}

const userEventReducer = (state: UserEventsState = initialState, action: LoadSuccessAction | CreateSuccessAction | DeleteSuccessAction | UpdateSuccessAction) => {

    switch (action.type) {
        case LOAD_SUCCESS:
            return loadSuccessReducer(state, action)
        case CREATE_SUCCESS:
            return createSuccessReducer(state, action)
        case DELETE_SUCCESS:
            return deleteSuccessReducer(state, action)
        case UPDATE_SUCCESS:
            return updateSuccessReducer(state, action)
        default:
            return state;
    }
}

export default userEventReducer;
