import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';


type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string>('')
    const addItem = () => {
        if (title.trim()) {
            props.addItem(title.trim())
            setTitle('')

        } else setError('Title is required')
    }
    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        error && setError('')
        e.key === 'Enter' && addItem()
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value.trimStart())
    }

    return (
        <div>
            <TextField
                variant="standard"
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onEnter}
                error={!!error}
                label="Title"
                helperText={error}
            />
            <IconButton sx={{mt: '9px'}} color='primary'
                        onClick={addItem} disabled={props.disabled}><AddTaskIcon/></IconButton>
        </div>
    );
});

