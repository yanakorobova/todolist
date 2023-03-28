import {AppRootStateType} from 'app/store'

export const selectTodolists = (state: AppRootStateType) => state.todolists
export const selectTask = (id: string) => (state: AppRootStateType) => state.tasks[id]