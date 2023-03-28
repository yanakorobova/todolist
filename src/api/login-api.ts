import {AxiosResponse} from "axios";
import {LoginType, UserType, ResponseType} from "api/types";
import {instance} from "api/main-api";

export const authAPI = {
    login(data: LoginType) {
        return instance.post<LoginType, AxiosResponse<ResponseType<{ userId: number }>>>('auth/login', data)
    },
    me() {
        return instance.get<ResponseType<UserType>>('auth/me')
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    }

}
