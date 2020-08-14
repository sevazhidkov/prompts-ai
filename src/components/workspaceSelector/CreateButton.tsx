import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core";

export default function CreateButton() {
    const onAdd = () => {
        console.log('123');
    };

    return <IconButton aria-label="close" onClick={onAdd} size={'small'}>
        <AddIcon/>
    </IconButton>;
}