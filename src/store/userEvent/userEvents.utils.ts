import {
    getUserEventsStart, getUsersEventError, getUsersEventSuccess,
    updateUserEventSuccess, createUserEventSuccess, deleteUserEventSuccess, IUserEvent
} from "./userEventsSlice"
import {TAppThunk} from "../../redux/store";
import {selectDateStart} from "../../redux/recorder";


export const loadUserEvent = (): TAppThunk => async (dispatch) => {
    dispatch(getUserEventsStart())

    try {
        const res = await fetch('http://localhost:3004/events');
        const events: IUserEvent[] = await res.json();
        dispatch(getUsersEventSuccess({events}))

    } catch (e) {
        dispatch(getUsersEventError('some error happened'))
    }
}

export const createUserEvent = (): TAppThunk => async (dispatch, getState) => {

    try {
        const dateStart = selectDateStart(getState());
        const event: Omit<IUserEvent, 'id'> = {
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

        const createdEvent: IUserEvent = await response.json()
        dispatch(createUserEventSuccess({event: createdEvent}))

    } catch (e) {
        alert('create alert')
    }
}

export const updateUserEvent = (userEvent: IUserEvent): TAppThunk => async (dispatch) => {

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

        dispatch(updateUserEventSuccess({event: updatedEvent}))

    } catch (e) {
        alert('update alert')
    }
}

export const deleteUserEvent = ({id}: { id: IUserEvent['id'] }): TAppThunk => async (dispatch) => {
    try {
        const response = await fetch(`http://localhost:3004/events/${id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            dispatch(deleteUserEventSuccess({id}))
        }

    } catch (e) {
        alert('sss')
    }
}


