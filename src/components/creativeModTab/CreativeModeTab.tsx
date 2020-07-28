import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {Box, Card, CardContent, Slider, Typography, Button, Grid, Switch, FormControlLabel} from "@material-ui/core";
import {useStyles} from "../modeTabs/ModeTabs";
import RunCreativeButton from "../runCreativeButton/RunCreativeButton";
import CreativeCompletionCollection from "../creativeCompletionCollection/CreativeCompletionCollection";
import {
    editMaxCreativeCompletions,
    selectMaxCreativeCompletions,
    cleanCreativeCompletions,
    selectShowPromptForCreativeCompletions,
    updateShowPromptForCreativeCompletions,
} from "../../app/slices/editorSlice";

export default function CreativeModeTab() {
    const styles = useStyles();
    const dispatch = useDispatch();

    const maxCompletions = useSelector(selectMaxCreativeCompletions);
    const handleMaxCompletionsChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editMaxCreativeCompletions(value as number));
    }

    const showPrompt = useSelector(selectShowPromptForCreativeCompletions);
    const handlePromptSwitchChange = (event: React.ChangeEvent<{}>, value: boolean) => {
        dispatch(updateShowPromptForCreativeCompletions(value));
    }

    return <Box>
        <Box mb={1}>
            <Card className={styles.instructionCard}>
                <CardContent>
                    <Typography variant="subtitle1">Creative generation</Typography>
                    <Typography variant="body2">
                        This is a tool to generate multiple completions from the same prompt. Use it to explore the variety
                        of GPT-3 completions and impact of parameters on them. If you like a completion, add it to the prompt
                        and GPT-3 will generate more similar completions.
                    </Typography>
                    <Box mt={1}>
                        <Typography id="max-creative-completions-slider" gutterBottom>
                            How many samples to generate (impacts processing time):
                        </Typography>
                        <Slider
                            defaultValue={10}
                            value={maxCompletions}
                            onChange={handleMaxCompletionsChange}
                            aria-labelledby="max-creative-completions-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={[{
                                value: 1,
                                label: '0',
                            }, {
                                value: 50,
                                label: '50',
                            }]}
                            min={1}
                            max={50}
                        />
                    </Box>

                    <Grid container spacing={1} alignItems="center">
                        <Grid item><RunCreativeButton/></Grid>
                        <Grid item><Button
                            onClick={() => dispatch(cleanCreativeCompletions())}
                        >Clean all</Button></Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item><FormControlLabel
                            control={<Switch checked={showPrompt} onChange={handlePromptSwitchChange}
                                             name="creative-completions-prompt-switch" color="primary"/>}
                            label="Show prompt"
                        /></Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
        <CreativeCompletionCollection/>
    </Box>;
}