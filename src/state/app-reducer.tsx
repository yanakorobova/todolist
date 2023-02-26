import {Dispatch} from "redux";
import {authAPI} from "../api/login-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppErrorAC = (error: null | string) => {
    return {type: 'APP/SET-ERROR', error} as const
}
export const setIsInitializedAC = (isInitialized: boolean) => {
    return {type: 'APP/SET-INITIALIZED', isInitialized} as const
}
export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
        .finally(() => dispatch(setIsInitializedAC(true)))
}


//types
type setAppStatusActionType = ReturnType<typeof setAppStatusAC>
type setAppErrorActionType = ReturnType<typeof setAppErrorAC>
type setIsInitializedActionType = ReturnType<typeof setIsInitializedAC>

type ActionsType = setAppStatusActionType | setAppErrorActionType | setIsInitializedActionType
