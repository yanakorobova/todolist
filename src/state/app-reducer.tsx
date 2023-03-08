import {Dispatch} from "redux";
import {authAPI} from "../api/login-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

const appSlice = createSlice(({
        name: "app",
        initialState,
        reducers: {
            setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
                state.status = action.payload.status
            },
            setAppErrorAC: (state, action: PayloadAction<{ error: null | string }>) => {
                state.error = action.payload.error
            },
            setIsInitializedAC: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
                state.isInitialized = action.payload.isInitialized
            }
        }
    }
))

export const appReducer = appSlice.reducer
export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = appSlice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:true}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else handleServerAppError(res.data, dispatch)
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
        .finally(() => dispatch(setIsInitializedAC({isInitialized:true})))
}


