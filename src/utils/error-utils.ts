import {Dispatch} from 'redux'
import {setAppErrorAC, setAppStatusAC} from "../state/app-reducer";
import {ResponseType} from "../api/todolist-api";
// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    data.messages.length ? dispatch(setAppErrorAC({error: data.messages[0]}))
        : dispatch(setAppErrorAC({error: 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

