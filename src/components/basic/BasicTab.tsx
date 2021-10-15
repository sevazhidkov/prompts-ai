import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchBasicOutputAsync,
    selectBasicLoading,
    selectBasicOutput,
} from "../../slices/editorSlice";
import {Box, Button, Card, CardContent, TextField, Typography} from "@material-ui/core";
import {useStyles} from '../ModeTabs';

export default function BasicTab() {
    const dispatch = useDispatch();

    const styles = useStyles();

    const fetchOutputs = () => {
        dispatch(fetchBasicOutputAsync());
    };

    const basicOutput = useSelector(selectBasicOutput);
    const basicLoading = useSelector(selectBasicLoading);

    return (
        <Box>
            <Box mb={1}>
                <Card className={styles.instructionCard}>
                    <CardContent>
                        <Typography variant="subtitle1">Simple</Typography>
                        <Typography variant="body2">This is a basic tool to explore the general idea of GPT-3. GPT-3 will try to continue text you wrote in the prompt field and will display the result in the field below.</Typography>
                        <Box mt={1}>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={fetchOutputs}
                                disabled={basicLoading}
                            >{basicLoading ? 'Processing...' : 'Run'}</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Box mb={1}>
                <Card className={styles.instructionCard}>
                    <CardContent>
                        <TextField
                            aria-readonly={"true"}
                            label="Output"
                            variant="outlined"
                            fullWidth={true}
                            multiline
                            rows={9}
                            rowsMax={500}
                            value={basicOutput}
                            InputProps={{
                                readOnly: true,
                            }}
                            placeholder={"Resulting text will appear here"}
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}