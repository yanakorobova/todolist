import axios from "axios";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '436e13e5-7a39-4a0e-a3a1-fdd2aeef7c42',
    },
})