import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type  TError = string | null


export type TUserEvent = {
    title: string;
    dateStart: string;
    dateEnd: string;
    id: number;
}

export interface IUserEvents {
    events: TUserEvent[]
}


export interface IUserEvent {
    id: number;
    title: string;
    dateStart: string;
    dateEnd: string;
}


export interface IUserEventsState {
    byIds: Record<IUserEvent['id'], IUserEvent>;
    allIds: IUserEvent['id'][],
    userEventsLoading?: boolean
    userEventsError?: TError
}

const initialState: IUserEventsState = {
    byIds: {},
    allIds: [],
    userEventsLoading: false,
    userEventsError: null
}


const usersEventsSlice = createSlice({
    name: 'userEvents',
    initialState,
    reducers: {
        getUserEventsStart: (state): IUserEventsState => {
            return {
                ...state,
                userEventsLoading: true,
                userEventsError: null,
            }
        },
        getUsersEventSuccess: (state, action: PayloadAction<TUserEvent[]>): IUserEventsState => {
            const events = action.payload
            return {
                ...state,
                userEventsLoading: false,
                userEventsError: null,
                allIds: events.map(({id}) => id),
                byIds: events.reduce<IUserEventsState['byIds']>((byIds, event) => {
                    byIds[event.id] = event
                    return byIds
                }, {})
            }
        },
        getUsersEventError: (state, {payload}: PayloadAction<TError>): IUserEventsState => ({
            ...state,
            userEventsLoading: false,
            userEventsError: payload,
        }),
        updateUserEventSuccess: (state, action: PayloadAction<TUserEvent>): IUserEventsState => {
            const event = action.payload;
            return {
                ...state,
                ...state.byIds,
                [event.id]: event,
                userEventsLoading: false,
                userEventsError: null,
            }
        },
        deleteUserEventSuccess: (state, action: PayloadAction<{ id: IUserEvent['id'] }>): IUserEventsState => {
            const {id} = action.payload
            return {
                ...state,
                byIds: {...state.byIds},
                allIds: state.allIds.filter((soredId => soredId !== id)),
                userEventsLoading: false,
                userEventsError: null,
            }
        },
        createUserEventSuccess: (state, action: PayloadAction<{ event: IUserEvent }>): IUserEventsState => {
            const {event} = action.payload
            return {
                ...state,
                allIds: [...state.allIds, event.id],
                byIds: {...state.byIds, [event.id]: event},
                userEventsLoading: false,
                userEventsError: null,
            };
        }
    }
})

export const {
    getUserEventsStart,
    getUsersEventSuccess,
    getUsersEventError,
    updateUserEventSuccess,
    deleteUserEventSuccess,
    createUserEventSuccess
} = usersEventsSlice.actions;

export default usersEventsSlice.reducer;
