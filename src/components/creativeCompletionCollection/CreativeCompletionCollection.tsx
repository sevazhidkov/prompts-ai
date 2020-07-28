import React from 'react';
import {useSelector} from "react-redux";
import {selectCreativeCompletions} from "../../app/slices/editorSlice";
import { Grid, Box } from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import CreativeCompletion from "../creativeCompletion/CreativeCompletion";

const useStyles = makeStyles({
    gridCard: {
        width: '100%',
    },
});


export default function CreativeCompletionCollection() {
    const completions = useSelector(selectCreativeCompletions);
    const styles = useStyles();

    return (
        <Box>
            <Grid container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={1}
            >
                {completions.slice().reverse().map(completion => (
                    <Grid item key={completion.id} xs={12} className={styles.gridCard}>
                        <CreativeCompletion {...completion} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}