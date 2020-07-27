import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {editExample, cleanExampleList} from "../../app/slices/editorSlice";
import {RootState} from "../../app/store";
import {TextField, Card, CardContent, Box, CircularProgress, Grid} from "@material-ui/core";

interface Props {
    ind: number;
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
}

function Example (props: Props) {
    const dispatch = useDispatch();
    const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(editExample({id: props.id, text: event.currentTarget.value}));
        dispatch(cleanExampleList());
    }
    const selectExampleText = useSelector((state: RootState) => {
        let example = state.editor.examples.find(example => example.id === props.id);
        if (example === undefined) {
            return '';
        }
        return example.text;
    });
    const selectExampleOutput = useSelector((state: RootState) => {
        let example = state.editor.examples.find(example => example.id === props.id);
        if (example === undefined) {
            return '';
        }
        return example.output;
    });

    return (
        <Card>
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <Grid item xs={11}>
                        <Box mb={2}>
                            <TextField
                                multiline
                                type={'text'}
                                value={selectExampleText}
                                onChange={handleInputChange}
                                fullWidth={true}
                                label={`Example ${props.ind + 1}`}
                                variant="outlined"
                            />
                        </Box>
                        <Box>
                            <TextField
                                multiline
                                type={'text'}
                                value={selectExampleOutput}
                                fullWidth={true}
                                label="GPT-3 Output"
                                variant="outlined"
                                InputLabelProps={{ shrink: selectExampleOutput !== undefined }}
                                disabled
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box>
                            {props.isLoading && <CircularProgress/>}
                        </Box>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
}

export default Example;