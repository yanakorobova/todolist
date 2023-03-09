import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistAC
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {
    todolistAPI,
    TaskType,
    TaskStatuses,
    TaskPriorities,
    UpdateTaskModelType
} from "../api/todolist-api";
import {AppRootStateType} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
            index > -1 && state[action.payload.todolistId].splice(index, 1)
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
        },
        setTasksAC: (state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.newTodolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(setTodolistAC, (state, action) => {
                action.payload.todos.forEach(l => {
                    state[l.id] = []
                })
            })

    }
})

export const tasksReducer = tasksSlice.reducer
export const {removeTaskAC, setTasksAC, updateTaskAC, addTaskAC} = tasksSlice.actions

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC({tasks: res.data.items, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })

    }
}
export const deleteTasksTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC({taskId, todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const createTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC({task: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC({status: 'loading'}))
        const task = getState().tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            return
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId, todolistId, domainModel}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else handleServerAppError(res.data, dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

//types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [todoListId: string]: TaskType[]
}









