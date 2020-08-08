import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    Box,
    FormControlLabel,
    IconButton,
    Theme,
    Typography,
    FormGroup,
    Switch,
    Button, CircularProgress, TextField
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import {makeStyles} from "@material-ui/core/styles";
import {
    selectCompletionParameters, selectExamples,
} from "../app/slices/editorSlice";
import SharedPrompt from '../resources/sharedPrompt';
import {useSelector} from "react-redux";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));


export default function SharePopup() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [link, setLink] = React.useState<string | undefined>(undefined);
    const [includeExamples, setIncludeExamples] = React.useState(true);

    const completionParameters = useSelector(selectCompletionParameters);
    const examples = useSelector(selectExamples);

    const handleClose = () => {
        setLink(undefined);
        setOpen(false);
    };

    return <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'sm'}
    >
        <DialogTitle id="scroll-dialog-title">
            Share Prompt
            <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <DialogContent
                id="scroll-dialog-description"
                tabIndex={-1}
            >
                <form onSubmit={(event) => {
                    event.preventDefault();
                    setLoading(true);
                    SharedPrompt.create({
                        engine: completionParameters.engine,
                        maxTokens: completionParameters.maxTokens,
                        stop: completionParameters.stop,
                        prompt: completionParameters.prompt,
                        temperature: completionParameters.temperature,
                        topP: completionParameters.topP,
                        presencePenalty: completionParameters.presencePenalty,
                        frequencyPenalty: completionParameters.frequencyPenalty,
                        examples: (includeExamples ? examples : undefined),
                    }).then(onFulfilled => {
                        setLoading(false);
                        setLink(onFulfilled.id)
                    });
                }}>
                    <Typography>If you edit your prompt after sharing a link, the shared prompt won't change.</Typography>
                    <Box mt={1}>
                        { link && (
                            <TextField disabled value={link} variant={'outlined'} size={'small'} fullWidth />
                        )}
                        { !link && (
                            <Box>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Switch checked={includeExamples} onChange={(event: React.ChangeEvent<{}>, value: boolean) => {
                                            setIncludeExamples(value);
                                        }} name="includeExamples" />}
                                        label="Include Examples"
                                    />
                                </FormGroup>
                                <Button disabled={loading} type="submit" variant="contained" color="primary">
                                    {loading && (
                                        <CircularProgress size={24} className={classes.buttonProgress}/>
                                    )}
                                    Create Link
                                </Button>
                            </Box>
                        )}
                    </Box>
                </form>

            </DialogContent>
        </DialogContent>
    </Dialog>;
}