import {AxiosResponse} from 'axios'
import {GetTasksResponse, TaskType, TodolistType, UpdateTaskModelType,ResponseType} from "api/types";
import { instance } from './main-api';


export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<{title:string},AxiosResponse<ResponseType>>(`todo-lists/${todolistId}`, {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    createTodolist(title: string) {
        return instance.post<{title:string}, AxiosResponse<ResponseType<{ item: TodolistType }>>>('todo-lists/', {title})
    },
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists/')
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }

}
