import {applyMiddleware, combineReducers, createStore} from 'redux'
import userEventReducer from "./user-events";
import recorderReducer from "./recorder"
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    userEvents: userEventReducer,
    recorder: recorderReducer
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
))



export default store
