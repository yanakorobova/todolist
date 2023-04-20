import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "components/AddItemForm";
import {EditableSpan} from "components/EditableSpan";
import {Button, IconButton} from '@mui/material';
import {Delete} from "@mui/icons-material";
import {
    changeTodolistFilterAC,
    deleteTodolistTC,
    updateTodolistTitleTC
} from "features/TodolistsList/todolists-reducer";
import {useAppDispatch, useAppSelector} from "app/store";
import {createTaskTC, getTasksTC} from "features/TodolistsList/tasks-reducer";
import {Task} from "./Task/Task";
import {FilterType} from "features/TodolistsList/TodolistsList";
import {TaskStatuses, TaskType, TodolistDomainType} from "api/types";
import {selectTask} from "features/TodolistsList/selectors";


type TodoListPropsType = {
    todolist: TodolistDomainType
}

const TodoList = React.memo(({todolist}: TodoListPropsType) => {

    const {id, filter, title, entityStatus} = todolist
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(selectTask(id))

    useEffect(() => {
        dispatch(getTasksTC(id))
    }, [])

    const changeTodolistTitle = useCallback((newTitle: string) => dispatch(updateTodolistTitleTC({
        todolistId: id,
        title: newTitle
    })), [id])

    const filteredTasks = filter === 'active' ? tasks.filter(t => t.status === TaskStatuses.New)
        : filter === 'completed' ? tasks.filter(t => t.status === TaskStatuses.Completed)
            : tasks

    const tasksElements = filteredTasks.length
        ? filteredTasks.map((task: TaskType) => {
            return <Task key={task.id} task={task} todolistId={id}/>
        })
        : <span>List is empty</span>

    const addTask = useCallback((title: string) => dispatch(createTaskTC({todolistId: id, title})), [id])

    const removeTodoList = useCallback(() => dispatch(deleteTodolistTC(id)), [id])

    const setFilterHandler = useCallback((filter: FilterType) => dispatch(changeTodolistFilterAC({
        todolistId: id,
        newFilter: filter
    })), [id])

    const renderFilterButton = (buttonFilter: FilterType, text: string) => {
        return <Button sx={{mr: buttonFilter === 'completed' ? '0px' : '5px', fontWeight: '600'}} variant="outlined"
                       size="small"
                       color={filter === buttonFilter ? 'secondary' : 'info'}
                       onClick={() => setFilterHandler(buttonFilter)}>{text}
        </Button>
    }

    return (
        <div >
            <h3>
                <EditableSpan title={title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodoList} disabled={entityStatus === 'loading'}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={entityStatus === 'loading'}/>
            <ul >
                {tasksElements}
            </ul>
            <div>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('active', 'Active')}
                {renderFilterButton('completed', 'Completed')}
            </div>
        </div>
    );
})

export default TodoList;
