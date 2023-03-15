import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan";
import {Button, IconButton} from '@mui/material';
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {
    changeTodolistFilterAC, deleteTodolistTC,
    TodolistDomainType, updateTodolistTitleTC
} from "../../../state/todolists-reducer";
import {useAppDispatch, useAppSelector} from "../../../state/store";
import {createTaskTC, getTasksTC} from "../../../state/tasks-reducer";
import {Task} from "./Task/Task";


type TodoListPropsType = {
    todolist: TodolistDomainType
}

const TodoList = React.memo(({todolist}: TodoListPropsType) => {

    const {id, filter, title, entityStatus} = todolist
    const dispatch = useAppDispatch()
    const tasks = useAppSelector<TaskType[]>(state => state.tasks[id])

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

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: id,
        newFilter: 'all'
    })), [id])
    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: id,
        newFilter: 'active'
    })), [id])
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: id,
        newFilter: 'completed'
    })), [id])

    return (
        <div>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodolistTitle}/>
                <IconButton onClick={removeTodoList} disabled={entityStatus === 'loading'}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={entityStatus === 'loading'}/>
            <ul>
                {tasksElements}
            </ul>
            <div>
                <Button sx={{mr: '5px', fontWeight: '600'}} variant="outlined" size="small"
                        color={filter === 'all' ? 'secondary' : 'info'}
                        onClick={onAllClickHandler}>All
                </Button>
                <Button sx={{mr: '5px', fontWeight: '600'}} variant="outlined" size="small"
                        color={filter === 'active' ? 'secondary' : 'info'}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button sx={{fontWeight: '600'}} variant="outlined" size="small"
                        color={filter === 'completed' ? 'secondary' : 'info'}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    );
})

export default TodoList;
