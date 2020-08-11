import {AppBar, Container, IconButton, Theme, Toolbar, Typography} from "@material-ui/core";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {
    selectApiKey,
    selectFrequencyPenalty,
    selectMaxTokens,
    selectModelName,
    selectPresencePenalty,
    selectPrompt,
    selectStopSymbols,
    selectTemperature,
    selectTopP,
    toggleApiKeyDialog,
    toggleTemplateDialog
} from "../app/slices/editorSlice";
import {ActionCreators} from "redux-undo";
import getTemplateGroups from "../libs/templatesLibrary";

const useStyles = makeStyles((theme: Theme) => ({
    buttonGroup: {
        marginRight: theme.spacing(2),
    },
    apiKeyInput: {
        minWidth: '400px',
    },
}));

export default function Header() {
    const dispatch = useDispatch();
    const classes = useStyles();

    const apiKey = useSelector(selectApiKey);
    const apiKeyPresent = !!apiKey;
    const handleApiKeyDialogOpen = () => {
        dispatch(toggleApiKeyDialog(true));
    };
    const handleTemplateDialogOpen = () => {
        dispatch(toggleTemplateDialog(true));
    };
    const handleUndoClick = () => {
        dispatch(ActionCreators.undo());
    };
    const handleRedoClick = () => {
        dispatch(ActionCreators.redo());
    };


    const prompt = useSelector(selectPrompt);
    const temperature = useSelector(selectTemperature);
    const topP = useSelector(selectTopP);
    const frequencyPenalty = useSelector(selectFrequencyPenalty);
    const presencePenalty = useSelector(selectPresencePenalty);
    const maxTokens = useSelector(selectMaxTokens);
    const stopSymbols = useSelector(selectStopSymbols);
    const modelName = useSelector(selectModelName);

    const handleSaveAndDownload = () => {
        const element = document.createElement("a");
        const savedStopSymbols = stopSymbols.map(symbol => {
            return symbol.split('\\n').join('\n');
        });
        const file = new Blob([
            JSON.stringify({prompt, temperature, topP,
                frequencyPenalty, presencePenalty,
                maxTokens, stopSymbols: savedStopSymbols, modelName,
            })
        ], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `prompt_${Math.trunc(Date.now() / 1000)}.json`;
        document.body.appendChild(element);
        element.click();
    }

    const templateGroups = getTemplateGroups();

    return <AppBar position="static">
        <Container maxWidth={"lg"}>
            <Toolbar variant="regular" disableGutters={true}>
                <div className={classes.buttonGroup}>
                    <Typography variant="h6" color="inherit">
                        Prompts.ai
                    </Typography>
                </div>
                <div className={classes.buttonGroup}>
                    <IconButton onClick={handleApiKeyDialogOpen}><VpnKeyIcon color={apiKeyPresent ? "action" : "error"}/></IconButton>
                </div>
                <div className={classes.buttonGroup}>
                    <IconButton onClick={handleUndoClick}><UndoIcon/></IconButton>
                    <IconButton onClick={handleRedoClick}><RedoIcon/></IconButton>
                </div>
                <div className={classes.buttonGroup}>
                    <IconButton onClick={handleSaveAndDownload}><SaveIcon/></IconButton>
                    <IconButton onClick={handleTemplateDialogOpen}><FolderOpenIcon/></IconButton>
                </div>
            </Toolbar>
        </Container>
    </AppBar>
}