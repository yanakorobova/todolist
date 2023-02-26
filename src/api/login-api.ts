import {instance, ResponseType} from "./todolist-api";
import {AxiosResponse} from "axios";


export type LoginType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}
export const authAPI = {
    login(data:LoginType) {
        return instance.post<LoginType,AxiosResponse<ResponseType<{userId:number}>>>('auth/login', data)
    },
    me(){
        return instance.get<ResponseType<UserType>>('auth/me')
    },
    logout(){
        return instance.delete<ResponseType>('auth/login')
    }

}

type UserType = {
    id: number
    email: string
    login: string
}