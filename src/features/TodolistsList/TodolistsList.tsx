import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "components/AddItemForm";
import {Grid, Paper,} from "@mui/material";
import {createTodolistTC, getTodolistsTC} from "features/TodolistsList/todolists-reducer"
import {useAppDispatch, useAppSelector} from "app/store";
import {Navigate} from "react-router-dom";
import TodoList from "./Todolist/Todolist";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {selectTodolists} from "features/TodolistsList/selectors";


export type FilterType = 'all' | 'completed' | 'active'

function TodolistsList() {

    const todoLists = useAppSelector(selectTodolists)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
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
            <Paper  elevation={2} sx={{p: '2rem'}}>
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
            <Grid container sx={{p: '20px', mb:'10px'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {todoListComponents}
            </Grid>
        </>
    )
}


export default TodolistsList;
