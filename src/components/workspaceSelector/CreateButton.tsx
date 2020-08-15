import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { createWorkspace } from '../../slices/editorSlice';

export default function CreateButton() {
    const dispatch = useDispatch();
    const onAdd = () => {
        dispatch(createWorkspace());
    };

    return <IconButton aria-label="close" onClick={onAdd} size={'small'}>
        <AddIcon/>
    </IconButton>;
}