import {
    clearTodolistDataAC,
    createTodolistTC,
    deleteTodolistTC,
    getTodolistsTC
} from "features/TodolistsList/todolists-reducer";
import {todolistAPI} from "api/todolist-api";
import {AppRootStateType} from "app/store";
import {setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {TasksStateType, UpdateDomainTaskModelType, UpdateTaskModelType} from "api/types";

const initialState: TasksStateType = {}

export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTasks(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks: res.data.items, todolistId}
    } catch (error) {
        //@ts-ignore
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({})
    }

})
export const deleteTasksTC = createAsyncThunk('tasks/deleteTasks',
    async (param: { todolistId: string, taskId: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTask(param.todolistId, param.taskId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return param
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
export const createTaskTC = createAsyncThunk('tasks/createTask',
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.createTask(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return {task: res.data.data.item}
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
export const updateTaskTC = createAsyncThunk('tasks/updateTask',
    async (param: { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }, {
        dispatch,
        rejectWithValue,
        getState
    }) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        const state = getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
        if (!task) {
            return rejectWithValue({})
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.domainModel
        }
        try {
            const res = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return param
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

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTodolistTC.fulfilled, (state, action) => {
                state[action.payload.newTodolist.id] = []
            })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(getTodolistsTC.fulfilled, (state, action) => {
                action.payload.todos.forEach(l => {
                    state[l.id] = []
                })
            })
            .addCase(getTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(deleteTasksTC.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId)
                index > -1 && state[action.payload.todolistId].splice(index, 1)
            })
            .addCase(createTaskTC.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
            })
            .addCase(clearTodolistDataAC,()=>{
                return {}
            })
    }
})

export const tasksReducer = tasksSlice.reducer









