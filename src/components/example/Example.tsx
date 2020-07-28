import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {editExample, deleteExample, cleanExampleList} from "../../app/slices/editorSlice";
import {RootState} from "../../app/store";
import {TextField, Card, CardContent, Box, CircularProgress, Grid, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {makeStyles, Theme} from "@material-ui/core/styles";

interface Props {
    ind: number;
    isLast: boolean;
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
    }
}));

function Example (props: Props) {
    const dispatch = useDispatch();
    const styles = useStyles();
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
        <Card className={styles.card}>
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

                            {!props.isLoading && !props.isLast && <IconButton onClick={() => {
                                dispatch(deleteExample(props.id));
                                dispatch(cleanExampleList());
                            }}>
                                <Delete />
                            </IconButton>}
                        </Box>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
}

export default Example;