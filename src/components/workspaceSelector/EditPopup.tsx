import React from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditableWorkspaceName,
  updateCurrentWorkspaceName,
  updateEditableWorkspaceName,
} from "../../slices/editorSlice";
import { ActionCreators } from "redux-undo";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditPopup(props: Props) {
  const dispatch = useDispatch();
  const editableName = useSelector(selectEditableWorkspaceName);
  const onSave = () => {
    dispatch(updateCurrentWorkspaceName());
    dispatch(ActionCreators.clearHistory());
    props.onClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          value={editableName}
          margin="dense"
          id="name"
          label="Name"
          onChange={(
            event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            dispatch(updateEditableWorkspaceName(event.currentTarget.value));
          }}
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
    </Dialog>
  );
}
