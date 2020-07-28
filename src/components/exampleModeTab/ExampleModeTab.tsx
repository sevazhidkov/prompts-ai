import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ExampleCollection from '../exampleCollection/ExampleCollection';
import {
    cleanExampleList,
    selectExamplePreviousOutputsStatus,
    updateExamplePreviousOutputsStatus
} from "../../app/slices/editorSlice";
import {Box, Typography, Card, CardContent, Grid, FormControlLabel, Switch} from "@material-ui/core";
import RunExamplesButton from "../runExamplesButton/RunExamplesButton";
import { useStyles } from '../modeTabs/ModeTabs';

// cleanExampleList

export default function ExampleModeTab() {
    const dispatch = useDispatch();

    const showPreviousOutputs = useSelector(selectExamplePreviousOutputsStatus);
    const handlePreviousOutputsSwitchChange = (event: React.ChangeEvent<{}>, value: boolean) => {
        dispatch(updateExamplePreviousOutputsStatus(value));
    }

    const styles = useStyles();
    useEffect(() => {
        dispatch(cleanExampleList());
    })

    return (
        <Box>
            <Box mb={1}>
                <Card className={styles.instructionCard}>
                    <CardContent>
                        <Typography variant="subtitle1">Multiple Examples</Typography>
                        <Typography variant="body2">This is a tool to quickly run your prompt on multiple examples.
                            You can use it for text transformation and classification tasks. Use "{"{example}"}" key in the prompt and the editor
                            will replace it with each of the following examples. The tool is useful to understand how changing a prompt and parameters
                            will impact generated results.
                        </Typography>
                        <Box mt={1}>
                            <RunExamplesButton/>
                        </Box>
                        <Box mt={1}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item><FormControlLabel
                                    control={<Switch value={showPreviousOutputs}
                                                     onChange={handlePreviousOutputsSwitchChange}
                                                     name="previous-outputs-switch" color="primary"/>}
                                    label="Show previous outputs"
                                /></Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <ExampleCollection/>
        </Box>
    );
}