import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'API-KEY': '975ad869-5791-4635-8b12-48484b4cb32f',
    },
})