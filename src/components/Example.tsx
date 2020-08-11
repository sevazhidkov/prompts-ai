import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    editExample,
    deleteExample,
    cleanExampleList,
    selectExamplePreviousOutputsStatus
} from "../slices/editorSlice";
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
    previousOutput?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
    }
}));

function Example (props: Props) {
    const dispatch = useDispatch();
    const styles = useStyles();
    const showPreviousOutput = useSelector(selectExamplePreviousOutputsStatus);
    const handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(editExample({id: props.id, text: event.currentTarget.value}));
        dispatch(cleanExampleList());
    }

    return (
        <Card className={styles.card}>
            <CardContent>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item xs={10} md={11}>
                        <Box mb={2}>
                            <TextField
                                multiline
                                type={'text'}
                                value={props.text}
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
                                value={props.output}
                                fullWidth={true}
                                label="GPT-3 Output"
                                variant="outlined"
                                InputLabelProps={{ shrink: props.output !== undefined }}
                                disabled
                            />
                        </Box>
                        {(showPreviousOutput && (
                            <Box mt={2}>
                                <TextField
                                    multiline
                                    type={'text'}
                                    value={props.previousOutput}
                                    fullWidth={true}
                                    label="Previous Output"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: props.previousOutput !== undefined }}
                                    disabled
                                />
                            </Box>
                        ))}
                    </Grid>
                    <Grid item xs={1} md={1}>
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