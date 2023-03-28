import {todolistAPI} from "api/todolist-api"
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {FilterType} from "features/TodolistsList/TodolistsList";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {TodolistDomainType} from "api/types";


const initialState: TodolistDomainType[] = []

export const getTodolistsTC = createAsyncThunk('todolists/getTodolists',
    async (_, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.getTodolists()
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todos: res.data}
        } catch (error) {
            //@ts-ignore
            handleServerNetworkError(error, dispatch)
            return rejectWithValue({})
        }
    })
export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (error) {
        //@ts-ignore
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})
export const createTodolistTC = createAsyncThunk('todolists/createTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {newTodolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (error) {
        //@ts-ignore
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }
})
export const updateTodolistTitleTC = createAsyncThunk('todolists/updateTodolistTitle',
    async (param: { todolistId: string, title: string }) => {
        await todolistAPI.updateTodolist(param.todolistId, param.title)
        return {newTodolistTitle: param.title, todolistId: param.todolistId}
    })

const todolistsSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeTodolistFilterAC: (state, action: PayloadAction<{ todolistId: string, newFilter: FilterType }>) => {
            const index = state.findIndex(l => l.id === action.payload.todolistId)
            state[index].filter = action.payload.newFilter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, id: string }>) => {
            const index = state.findIndex(l => l.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todos.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
            return state.filter(l => l.id !== action.payload.todolistId)
        })
        builder.addCase(createTodolistTC.fulfilled, (state, action) => {
            state.push({...action.payload.newTodolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(l => l.id === action.payload.todolistId)
            state[index].title = action.payload.newTodolistTitle
        })
    }
})
export const todolistsReducer = todolistsSlice.reducer
export const {changeTodolistEntityStatusAC, changeTodolistFilterAC} = todolistsSlice.actions



