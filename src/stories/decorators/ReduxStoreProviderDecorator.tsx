import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { AppRootStateType } from '../../state/store'
import { tasksReducer } from '../../state/tasks-reducer'
import { todolistsReducer } from '../../state/todolists-reducer'
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {appReducer} from "../../state/app-reducer";
import {authReducer} from "../../state/auth-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all',order:0, addedDate: '',entityStatus:''},
        {id: 'todolistId2', title: 'What to buy', filter: 'all',order:0, addedDate: '',entityStatus:''}
    ],
    tasks: {
        'todolistId1':[
            {
                id: '1',
                title: 'task1',
                status: TaskStatuses.New,
                todoListId: 'todolistId1', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            }
        ],
        'todolistId2': [
            {
                id: '2',
                title: 'task2',
                status: TaskStatuses.New,
                todoListId: 'todolistId2', description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            }
        ]
    },
    app: {status:'loading',error:null,isInitialized:false},
    auth: {isLoggedIn: false}
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
