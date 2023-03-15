import {authAPI} from "../api/login-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (_, {dispatch, rejectWithValue}) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}))
    }
})
const appSlice = createSlice(({
        name: "app",
        initialState,
        reducers: {
            setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
                state.status = action.payload.status
            },
            setAppErrorAC: (state, action: PayloadAction<{ error: null | string }>) => {
                state.error = action.payload.error
            }
        },
        extraReducers: (builder) => {
            builder.addCase(initializeAppTC.fulfilled, (state) => {
                state.isInitialized = true
            })
        }
    }
))

export const appReducer = appSlice.reducer
export const {setAppStatusAC, setAppErrorAC} = appSlice.actions



