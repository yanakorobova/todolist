import {todolistAPI, TodolistType} from "../api/todolist-api"
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {FilterType} from "../features/TodolistsList/TodolistsList";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = []

const todolistsSlice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolistAC: (state, action: PayloadAction<{ todolistId: string }>) => {
            return state.filter(l => l.id !== action.payload.todolistId)
        },
        addTodolistAC: (state, action: PayloadAction<{ newTodolist: TodolistType }>) => {
            state.push({...action.payload.newTodolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC: (state, action: PayloadAction<{ todolistId: string, newTodolistTitle: string }>) => {
            const index = state.findIndex(l => l.id === action.payload.todolistId)
            state[index].title = action.payload.newTodolistTitle
        },
        changeTodolistFilterAC: (state, action: PayloadAction<{ todolistId: string, newFilter: FilterType }>) => {
            const index = state.findIndex(l => l.id === action.payload.todolistId)
            state[index].filter = action.payload.newFilter
        },
        setTodolistAC: (state, action: PayloadAction<{ todos: TodolistType[] }>) => {
            return action.payload.todos.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, id: string }>) => {
            const index = state.findIndex(l => l.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    }
})
export const todolistsReducer = todolistsSlice.reducer
export const {
    removeTodolistAC,
    addTodolistAC,
    setTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC
} = todolistsSlice.actions

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistAC({todos: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const deleteTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC({todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const createTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({newTodolist: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const updateTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.updateTodolist(todolistId, title)
            .then(() => {
                dispatch(changeTodolistTitleAC({newTodolistTitle: title, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    }
}


//types
export type TodolistDomainType = TodolistType & { filter: FilterType, entityStatus: RequestStatusType }


