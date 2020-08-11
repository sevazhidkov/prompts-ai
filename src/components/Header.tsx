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
} from "../slices/editorSlice";
import {ActionCreators} from "redux-undo";
import getTemplateGroups from "../libs/templatesLibrary";
import DownloadButton from "./fileExport/DownloadButton";

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
                    <DownloadButton/>
                    <IconButton onClick={handleTemplateDialogOpen}><FolderOpenIcon/></IconButton>
                </div>
            </Toolbar>
        </Container>
    </AppBar>
}