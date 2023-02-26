import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistActionType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {todolistAPI, TaskType, TaskStatuses, TaskPriorities, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export const tasksReducer = (state: TasksStateType = {}, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .filter(task => task.id !== action.taskId)
            }
        case "ADD-TASK":
            return {...state, [action.task.todoListId]: [...state[action.task.todoListId], action.task]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST":
            delete state[action.id]
            return {...state}
        case "SET-TODOLISTS":
            const tasks = {...state}
            action.todos.forEach(t => {
                tasks[t.id] = []
            })
            return tasks
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const updateTaskAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
    return {type: 'UPDATE-TASK', taskId, todolistId, domainModel} as const
}
export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}

export const getTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                    dispatch(setTasksAC(res.data.items, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
            })
            .catch((error) => {
                handleServerNetworkError(error,dispatch)
            })

    }
}
export const deleteTasksTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else handleServerAppError(res.data,dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error,dispatch)
            })
    }
}
export const createTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else handleServerAppError(res.data,dispatch)
            })
            .catch((error) => {
                handleServerNetworkError(error,dispatch)
            })
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC('loading'))
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
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else handleServerAppError(res.data,dispatch)
            })
            .catch((error)=>{
                handleServerNetworkError(error,dispatch)
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

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>


type ActionType = RemoveTaskActionType | AddTaskActionType | UpdateTaskActionType
    | AddTodolistActionType | RemoveTodolistActionType
    | SetTodolistActionType | SetTasksActionType

export type TasksStateType = {
    [todoListId: string]: TaskType[]
}









