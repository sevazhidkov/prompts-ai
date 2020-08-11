import React from 'react';
import Example from './Example';
import {useSelector} from "react-redux";
import {selectExamples} from "../../slices/editorSlice";
import { Grid, Box } from '@material-ui/core';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    gridCard: {
        width: '100%',
    },
});


export default function ExampleCollection() {
    const examples = useSelector(selectExamples);
    const styles = useStyles();

    return (
        <Box>
            <Grid container
                  direction="column"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={1}
            >
                {examples.map((example, ind) => (
                    <Grid item key={example.id} xs={12} className={styles.gridCard}>
                        <Example ind={ind} isLast={ind === examples.length - 1} {...example}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}