import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "components/EditableSpan";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {
    deleteTasksTC, updateTaskTC,
} from "features/TodolistsList/tasks-reducer";
import {useAppDispatch} from "app/store";
import {TaskStatuses, TaskType} from "api/types";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId}: TaskPropsType) => {
    const {id, status, title} = task
    const dispatch = useAppDispatch()
    const removeTask = useCallback(() => dispatch(deleteTasksTC({todolistId, taskId: id})), [])
    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newStatus = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC({taskId: id, domainModel: {status: newStatus}, todolistId}))
    }, [])
    const changeTaskTitle = useCallback((newTitle: string) => {
        dispatch(updateTaskTC({taskId: id, domainModel: {title: newTitle}, todolistId}))
    }, [id, todolistId])

    return (
        <li key={id} className={!!status ? 'isDone' : ''}>
            <Checkbox color='primary' checked={!!status} onChange={changeTaskStatus}/>
            <EditableSpan title={title} changeTitle={changeTaskTitle} taskStatus={status}/>
            <IconButton onClick={removeTask} color='warning'><CancelPresentationIcon/></IconButton>
        </li>
    );
})

