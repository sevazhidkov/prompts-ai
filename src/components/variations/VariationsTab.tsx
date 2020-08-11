import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {Box, Card, CardContent, Slider, Typography, Button, Grid, Switch, FormControlLabel} from "@material-ui/core";
import {useStyles} from "../ModeTabs";
import FetchVariationsButton from "./FetchVariationsButton";
import VariationsCollection from "./VariationsCollection";
import {
    editMaxVariations,
    selectMaxVariations,
    cleanVariations,
    selectShowPromptForVariations,
    updateShowPromptForVariations,
} from "../../slices/editorSlice";

export default function VariationsTab() {
    const styles = useStyles();
    const dispatch = useDispatch();

    const maxCompletions = useSelector(selectMaxVariations);
    const handleMaxVariationsChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editMaxVariations(value as number));
    }

    const showPrompt = useSelector(selectShowPromptForVariations);
    const handlePromptSwitchChange = (event: React.ChangeEvent<{}>, value: boolean) => {
        dispatch(updateShowPromptForVariations(value));
    }

    return <Box>
        <Box mb={1}>
            <Card className={styles.instructionCard}>
                <CardContent>
                    <Typography variant="subtitle1">Variations</Typography>
                    <Typography variant="body2">
                        This is a tool to generate multiple completions from the same prompt. Use it to explore the variety
                        of GPT-3 completions and impact of parameters on them. If you like a completion, add it to the prompt
                        and GPT-3 will generate more similar completions.
                    </Typography>
                    <Box mt={1}>
                        <Typography id="max-variations-slider" gutterBottom>
                            How many samples to generate (impacts processing time):
                        </Typography>
                        <Slider
                            defaultValue={10}
                            value={maxCompletions}
                            onChange={handleMaxVariationsChange}
                            aria-labelledby="max-variations-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks={[{
                                value: 1,
                                label: '0',
                            }, {
                                value: 15,
                                label: '15',
                            }]}
                            min={1}
                            max={15}
                        />
                    </Box>

                    <Grid container spacing={1} alignItems="center">
                        <Grid item><FetchVariationsButton/></Grid>
                        <Grid item><Button
                            onClick={() => dispatch(cleanVariations())}
                        >Clean all</Button></Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item><FormControlLabel
                            control={<Switch checked={showPrompt} onChange={handlePromptSwitchChange}
                                             name="variations-prompt-switch" color="primary"/>}
                            label="Show prompt"
                        /></Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
        <VariationsCollection/>
    </Box>;
}