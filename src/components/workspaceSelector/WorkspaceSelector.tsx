import React from "react";
import { Select, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CreateButton from "./CreateButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import {
  selectWorkspacesList,
  selectCurrentWorkspaceId,
  updateWorkspaceId,
} from "../../slices/editorSlice";
import { useDispatch, useSelector } from "react-redux";
import { ActionCreators } from "redux-undo";

const useStyles = makeStyles({
  selectGridItem: {
    width: "150px",
  },
});

export default function WorkspaceSelector() {
  const styles = useStyles();
  const dispatch = useDispatch();
  const workspaceId = useSelector(selectCurrentWorkspaceId);
  const workspaces = useSelector(selectWorkspacesList);

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(updateWorkspaceId(event.target.value as string));
    dispatch(ActionCreators.clearHistory());
  };
  return (
    <Grid container alignItems={"center"} spacing={1}>
      <Grid item className={styles.selectGridItem}>
        <Select
          native
          value={workspaceId}
          fullWidth={true}
          onChange={handleSelectChange}
        >
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </Select>
      </Grid>
      <Grid item>
        <CreateButton />
      </Grid>
      <Grid item>
        <EditButton />
      </Grid>
      <Grid item>
        <DeleteButton />
      </Grid>
    </Grid>
  );
}
