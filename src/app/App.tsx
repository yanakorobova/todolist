import React, {useCallback, useEffect} from 'react'
import TodolistsList from '../features/TodolistsList/TodolistsList'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {CircularProgress, LinearProgress} from "@mui/material";
import {useAppDispatch, useAppSelector} from "app/store";
import {initializeAppTC} from "app/app-reducer";
import {ErrorSnackbar} from "components/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Auth} from "features/Auth/Auth";
import {logoutTC} from "features/Auth/auth-reducer";
import {selectAppStatus, selectIsAppInitialized} from "app/selectors";
import {selectIsLoggedIn} from "features/Auth/selectors";


function App() {

    const status = useAppSelector(selectAppStatus)
    const isInitialized = useAppSelector(selectIsAppInitialized)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    const logOutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [])

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div>
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoList
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed sx={{pb: '50px'}}>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Auth/>}/>

                    <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App

