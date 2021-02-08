import {Action, applyMiddleware, combineReducers, createStore} from 'redux'
import recorderReducer from "../store/recorder/recorderSlice"
import userEventReducer from "../store/userEvent/userEventsSlice"
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, {ThunkAction} from "redux-thunk";


const rootReducer = combineReducers({
    userEvents: userEventReducer,
    recorder: recorderReducer
})

export type RootState = ReturnType<typeof rootReducer>
export type TAppThunk = ThunkAction<void, RootState, null, Action<string>>;

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
))





export default store
