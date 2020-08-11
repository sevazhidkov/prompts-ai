import React from 'react';
import {useSelector} from "react-redux";
import {selectVariations} from "../../app/slices/editorSlice";
import { Grid, Box } from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";
import Variation from "../variation/Variation";

const useStyles = makeStyles({
    gridCard: {
        width: '100%',
    },
});


export default function VariationsCollection() {
    const completions = useSelector(selectVariations);
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
                        <Variation {...completion} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}