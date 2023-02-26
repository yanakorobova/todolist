
import {todolistAPI, TodolistType} from "../api/todolist-api"
import {Dispatch} from "redux";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {updateTaskAC} from "./tasks-reducer";
import {FilterType} from "../features/TodolistsList/TodolistsList";


export const todolistsReducer = (state: TodolistDomainType[] = [], action: ActionType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return [...state].filter(l => l.id !== action.id)
        case 'ADD-TODOLIST':
            return [...state, {...action.todolist, filter: 'all', entityStatus: 'idle'}]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(l => l.id === action.id
                ? {...l, title: action.title} : l)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(l => l.id === action.id
                ? {...l, filter: action.filter} : l)
        case "SET-TODOLISTS":
            return action.todos.map(t => ({...t, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(l => l.id === action.id
                ? {...l, entityStatus: action.entityStatus} : l)
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (newTodolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist: newTodolist} as const
}
export const changeTodolistTitleAC = (todolistId: string, newTodolistTitle: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: newTodolistTitle} as const
}
export const changeTodolistFilterAC = (todolistId: string, newFilter: FilterType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: newFilter} as const
}
export const setTodolistAC = (todos: TodolistType[]) => {
    return {type: 'SET-TODOLISTS', todos} as const
}
export const changeTodolistEntityStatusAC = (entityStatus: RequestStatusType, id: string) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', entityStatus, id} as const
}

export const getTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const deleteTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC('loading', todolistId))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const createTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const updateTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}


//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>
type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

type ActionType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType | SetTodolistActionType
    | ChangeTodolistEntityStatusActionType

export type TodolistDomainType = TodolistType & { filter: FilterType, entityStatus: RequestStatusType }


