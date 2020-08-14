import React from 'react';
import { Select, Grid } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CreateButton from './CreateButton';
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";

const useStyles = makeStyles({
    selectGridItem: {
        width: '150px',
    },
});

export default function WorkspaceSelector() {
    const styles = useStyles();

    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        console.log(event.target.value as string);
    }
    return <Grid container alignItems={'center'} spacing={1}>
        <Grid item className={styles.selectGridItem}>
            <Select
                native
                value={"draft1"}
                fullWidth={true}
                onChange={handleSelectChange}
            >
                <option value={"draft1"}>Draft 1</option>
                <option value={"draft2"}>Draft 2</option>
                <option value={"draft3"}>Draft 3</option>
            </Select>
        </Grid>
        <Grid item>
            <CreateButton/>
        </Grid>
        <Grid item>
            <EditButton/>
        </Grid>
        <Grid item>
            <DeleteButton/>
        </Grid>

    </Grid>;
}
