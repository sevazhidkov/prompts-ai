import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { createWorkspace } from '../../slices/editorSlice';
import {ActionCreators} from "redux-undo";

export default function CreateButton() {
    const dispatch = useDispatch();
    const onAdd = () => {
        dispatch(createWorkspace());
        dispatch(ActionCreators.clearHistory())
    };

    return <IconButton aria-label="close" onClick={onAdd} size={'small'}>
        <AddIcon/>
    </IconButton>;
}