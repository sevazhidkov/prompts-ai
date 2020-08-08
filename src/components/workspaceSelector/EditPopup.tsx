import React from 'react';
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions, Button } from '@material-ui/core';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function EditPopup(props: Props) {
    const onSave = () => {
        console.log('123');
    };
    return <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                value={'123'}
                margin="dense"
                id="name"
                label="Name"
                fullWidth
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose} color="primary">
                Cancel
            </Button>
            <Button onClick={onSave} color="primary">
                Save
            </Button>
        </DialogActions>
    </Dialog>;
}
