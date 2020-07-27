import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import TemplatesForm from '../templateForm/TemplatesForm';
import {selectPrompt, editPrompt} from "../../app/slices/editorSlice";
import {Typography, Slider, TextField, Grid} from "@material-ui/core";

export function PromptEditor() {
    const dispatch = useDispatch();
    const prompt = useSelector(selectPrompt);
    const handlePromptChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(editPrompt(event.currentTarget.value));
    }

    return (
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={5}
            >
                <Grid item xs={12} md={6}>
                    <TextField
                        id="prompt-text"
                        label="A prompt"
                        multiline
                        rows={6}
                        rowsMax={100}
                        fullWidth={true}
                        onChange={handlePromptChange}
                        value={prompt}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography id="temperature-slider" gutterBottom>
                        Temperature:
                    </Typography>
                    <Slider
                        defaultValue={0.5}
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
                </Grid>
                <Grid item xs={12} md={3}>
                    <TemplatesForm/>
                </Grid>
            </Grid>
        </div>
    );
}