import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Typography, Slider, TextField, Grid, Tooltip, Box, Card, CardContent} from "@material-ui/core";
import ChipInput from 'material-ui-chip-input'
import TemplatesForm from '../templateForm/TemplatesForm';
import {selectPrompt, editPrompt, selectTemperature, editTemperature,
    selectMaxTokens, editMaxTokens, selectStopSymbols,
    addStopSymbol, deleteStopSymbol} from "../../app/slices/editorSlice";

export function PromptEditor() {
    const dispatch = useDispatch();
    const prompt = useSelector(selectPrompt);
    const temperature = useSelector(selectTemperature);
    const maxTokens = useSelector(selectMaxTokens);
    const stopSymbols = useSelector(selectStopSymbols);
    const handlePromptChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(editPrompt(event.currentTarget.value));
    }
    const handleTemperatureChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editTemperature(value as number));
    }
    const handleMaxTokensChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editMaxTokens(value as number));
    }

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={3}
            >
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        id="prompt-text"
                        label="A prompt"
                        multiline
                        rows={23}
                        rowsMax={100}
                        fullWidth={true}
                        onChange={handlePromptChange}
                        value={prompt}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Card>
                        <CardContent>
                            <Typography id="max-tokens-slider" gutterBottom>
                                <strong>Parameters</strong>
                            </Typography>
                            <Tooltip title={'"Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive."'}
                                     placement="left">
                                <Typography id="temperature-slider" gutterBottom>
                                    Temperature:
                                </Typography>
                            </Tooltip>
                            <Slider
                                defaultValue={0.5}
                                value={temperature}
                                onChange={handleTemperatureChange}
                                aria-labelledby="temperature-slider"
                                valueLabelDisplay="auto"
                                step={0.05}
                                marks={[{
                                    value: 0,
                                    label: '0',
                                }, {
                                    value: 1,
                                    label: '1',
                                }]}
                                min={0}
                                max={1}
                            />
                            <Typography id="max-tokens-slider" gutterBottom>
                                Response length (in words):
                            </Typography>
                            <Slider
                                defaultValue={10}
                                aria-labelledby="max-tokens-slider"
                                valueLabelDisplay="auto"
                                value={maxTokens}
                                onChange={handleMaxTokensChange}
                                step={1}
                                marks={[{
                                    value: 1,
                                    label: '1',
                                }, {
                                    value: 512,
                                    label: '512',
                                }]}
                                min={1}
                                max={512}
                            />

                            <Tooltip title="On which symbols GPT-3 should stop generating text. Enter \n for a line break." placement="left">
                                <Typography gutterBottom>
                                    Stop sequences:
                                </Typography>
                            </Tooltip>
                            <ChipInput
                                value={stopSymbols}
                                onAdd={(chip) => dispatch(addStopSymbol(chip))}
                                onDelete={(deletedChip) => dispatch(deleteStopSymbol(deletedChip))}
                                onBeforeAdd={() => stopSymbols.length !== 4}
                                newChipKeys={['Tab']}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <Box mt={0}>
                        <Card>
                            <CardContent>
                                <Typography id="max-tokens-slider" gutterBottom>
                                    <strong>Templates</strong>
                                </Typography>
                                <TemplatesForm/>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box mt={1}>
                        <Card>
                            <CardContent>
                                <Typography id="max-tokens-slider" gutterBottom>
                                    <strong>Advanced parameters</strong>
                                </Typography>
                                <Tooltip title={'"Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered."'} placement="left">
                                    <Typography id="top-p-slider" gutterBottom>
                                        Top P
                                    </Typography>
                                </Tooltip>
                                <Slider
                                    defaultValue={0.5}
                                    value={temperature}
                                    onChange={handleTemperatureChange}
                                    aria-labelledby="top-p-slider"
                                    valueLabelDisplay="auto"
                                    step={0.05}
                                    marks={[{
                                        value: 0,
                                        label: '0',
                                    }, {
                                        value: 1,
                                        label: '1',
                                    }]}
                                    min={0}
                                    max={1}
                                />
                                <Tooltip title={'"How much to penalize new tokens based on their existing frequency in the text so far. Decreases the model\'s likelihood to repeat the same line verbatim."'} placement="left">
                                    <Typography id="frequency-penalty-slider" gutterBottom>
                                        Frequency Penalty
                                    </Typography>
                                </Tooltip>
                                <Slider
                                    defaultValue={0.5}
                                    value={temperature}
                                    onChange={handleTemperatureChange}
                                    aria-labelledby="frequency-penalty-slider"
                                    valueLabelDisplay="auto"
                                    step={0.05}
                                    marks={[{
                                        value: 0,
                                        label: '0',
                                    }, {
                                        value: 1,
                                        label: '1',
                                    }]}
                                    min={0}
                                    max={1}
                                />
                                <Tooltip title={'"How much to penalize new tokens based on whether they appear in the text so far. Increases the model\'s likelihood to talk about new topics."'} placement="left">
                                    <Typography id="presence-penalty-slider" gutterBottom>
                                        Presence Penalty
                                    </Typography>
                                </Tooltip>
                                <Slider
                                    defaultValue={0.5}
                                    value={temperature}
                                    onChange={handleTemperatureChange}
                                    aria-labelledby="presence-penalty-slider"
                                    valueLabelDisplay="auto"
                                    step={0.05}
                                    marks={[{
                                        value: 0,
                                        label: '0',
                                    }, {
                                        value: 1,
                                        label: '1',
                                    }]}
                                    min={0}
                                    max={1}
                                />
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}