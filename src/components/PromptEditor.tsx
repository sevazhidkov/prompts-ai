import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    Typography,
    Slider,
    TextField,
    Grid,
    Tooltip,
    Card,
    CardContent,
    Select,
    Box
} from "@material-ui/core";
import ChipInput from 'material-ui-chip-input'
import {
    selectPrompt,
    editPrompt,
    selectTemperature,
    editTemperature,
    selectMaxTokens,
    editMaxTokens,
    selectStopSymbols,
    addStopSymbol,
    deleteStopSymbol,
    editTopP,
    editFrequencyPenalty,
    editPresencePenalty,
    selectTopP,
    selectFrequencyPenalty, selectPresencePenalty, selectModelName, editModelName
} from "../slices/editorSlice";
import {makeStyles} from "@material-ui/styles";
import ModeTabs from "./ModeTabs";
import WorkspaceForm from "./WorkspaceForm";

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    },
});

export function PromptEditor() {
    const dispatch = useDispatch();
    const styles = useStyles();

    const prompt = useSelector(selectPrompt);
    const temperature = useSelector(selectTemperature);
    const topP = useSelector(selectTopP);
    const frequencyPenalty = useSelector(selectFrequencyPenalty);
    const presencePenalty = useSelector(selectPresencePenalty);
    const maxTokens = useSelector(selectMaxTokens);
    const stopSymbols = useSelector(selectStopSymbols);

    const availableModelNames = ['davinci', 'curie', 'babbage', 'ada'];
    const modelName = useSelector(selectModelName);

    const handlePromptChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(editPrompt(event.currentTarget.value));
    }
    const handleTemperatureChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editTemperature(value as number));
    }
    const handleTopPChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editTopP(value as number));
    }
    const handleFrequencyPenaltyChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editFrequencyPenalty(value as number));
    }
    const handlePresencePenaltyChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editPresencePenalty(value as number));
    }
    const handleMaxTokensChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
        dispatch(editMaxTokens(value as number));
    }
    const handleModelNameChange = (event: any) => {
        dispatch(editModelName(event.target.value));
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
                <Grid item xs={12} sm={3} md={3}>
                    {/*<Box mb={1}>
                        <Card>
                            <CardContent>
                                <Box>
                                    <Grid container>
                                        <Grid item><Button
                                            onClick={() => dispatch(ActionCreators.undo())}
                                        >
                                            Undo
                                        </Button></Grid>
                                        <Grid item>
                                            <Button
                                                aria-label="Undo last change"
                                                onClick={() => dispatch(ActionCreators.redo())}
                                            >
                                                Redo
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                aria-label="Save as a file"
                                                onClick={handleSaveAndDownload}
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <hr/>
                                <Box mt={2}>
                                    <Grid container>
                                        <Grid item
                                              className={styles.fullWidth}>
                                            <TextField type="password"
                                                       variant="outlined"
                                                       label="API Key"
                                                       size={'small'}
                                                       value={apiKey}
                                                       onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                                           dispatch(editApiKey(event.currentTarget.value));
                                                       }}
                                                       inputProps={{
                                                           autoComplete: 'new-password',
                                                           form: {
                                                               autoComplete: 'off',
                                                           },
                                                       }}
                                                       className={styles.fullWidth}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>*/}
                    <Box mb={1}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom>
                                    <strong>Workspace</strong>
                                </Typography>
                                <WorkspaceForm/>
                            </CardContent>
                        </Card>
                    </Box>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom>
                                <strong>Parameters</strong>
                            </Typography>
                            <Tooltip title={'"Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive."'}
                                     placement="left">
                                <Typography id="temperature-slider" gutterBottom>
                                    Temperature: <strong>{temperature}</strong>
                                </Typography>
                            </Tooltip>
                            <Slider
                                defaultValue={0.5}
                                value={temperature}
                                onChange={handleTemperatureChange}
                                aria-labelledby="temperature-slider"
                                valueLabelDisplay="auto"
                                step={0.01}
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
                                Response length: <strong>{maxTokens}</strong>
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
                                className={styles.fullWidth}
                            />
                        </CardContent>

                        <CardContent>
                            <Typography gutterBottom>
                                <strong>Advanced parameters</strong>
                            </Typography>
                            <Tooltip title={'"Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered."'} placement="left">
                                <Typography id="top-p-slider" gutterBottom>
                                    Top P: <strong>{topP}</strong>
                                </Typography>
                            </Tooltip>
                            <Slider
                                defaultValue={0.5}
                                value={topP}
                                onChange={handleTopPChange}
                                aria-labelledby="top-p-slider"
                                valueLabelDisplay="auto"
                                step={0.01}
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
                                    Frequency Penalty: <strong>{frequencyPenalty}</strong>
                                </Typography>
                            </Tooltip>
                            <Slider
                                defaultValue={0.5}
                                value={frequencyPenalty}
                                onChange={handleFrequencyPenaltyChange}
                                aria-labelledby="frequency-penalty-slider"
                                valueLabelDisplay="auto"
                                step={0.01}
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
                                    Presence Penalty: <strong>{presencePenalty}</strong>
                                </Typography>
                            </Tooltip>
                            <Slider
                                defaultValue={0.5}
                                value={presencePenalty}
                                onChange={handlePresencePenaltyChange}
                                aria-labelledby="presence-penalty-slider"
                                valueLabelDisplay="auto"
                                step={0.01}
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
                            <Typography id="model-name-typography" gutterBottom>
                                Model name:
                            </Typography>
                            <Select native id="model-name-select" name="modelName" value={modelName} onChange={handleModelNameChange} className={styles.fullWidth}>
                                {availableModelNames.map((modelName, ind) => (
                                    <option key={ind} value={modelName}>{modelName}</option>
                                ))}
                            </Select>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                    <TextField
                        id="prompt-text"
                        label="A prompt"
                        multiline
                        rows={9}
                        rowsMax={100}
                        fullWidth={true}
                        onChange={handlePromptChange}
                        value={prompt}
                        variant="outlined"
                    />
                    <br/>
                    <br/>
                    <ModeTabs/>
                </Grid>

            </Grid>
        </div>
    );
}