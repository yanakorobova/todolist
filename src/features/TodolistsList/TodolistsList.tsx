import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../components/AddItemForm";
import {Grid, Paper,} from "@mui/material";
import {
    createTodolistTC, getTodolistsTC, TodolistDomainType
} from "../../state/todolists-reducer"
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../state/store";

import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import TodoList from "./Todolist/Todolist";


export type FilterType = 'all' | 'completed' | 'active'

function TodolistsList() {

    const todoLists = useAppSelector<TodolistDomainType[]>(state => state.todolists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(getTodolistsTC())
    }, [])

    const addTodoList = useCallback((title: string) => dispatch(createTodolistTC(title)), [])

    const todoListComponents = todoLists.map((todoList) => {
        return <Grid item key={todoList.id}>
            <Paper sx={{p: '10px'}}>
                <TodoList
                    todolist={todoList}
                />
            </Paper>
        </Grid>
    })
    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }
    return (
        <>
            <Grid container sx={{p: '20px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {todoListComponents}
            </Grid>
        </>
    )
}


export default TodolistsList;
