import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader, Theme
} from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import React from "react";
// @ts-ignore
import Files from "react-files";
import {useDispatch, useSelector} from "react-redux";
import {
    cleanExampleList,
    loadTemplate,
    loadTemplateFromFileData,
    LoadTemplateFromFileDataActionPayload,
    selectTemplateDialogVisible,
    toggleTemplateDialog
} from "../../app/slices/editorSlice";
import getTemplateGroups, {Template} from "../../libs/templatesLibrary";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    templateDialog: {
        minWidth: '50vw',
    },
}));

export default function TemplateDialog() {
    const dispatch = useDispatch();
    const classes = useStyles();

    const templateDialogOpen = useSelector(selectTemplateDialogVisible);
    const handleTemplateDialogClose = () => {
        dispatch(toggleTemplateDialog(false));
    };

    const templateGroups = getTemplateGroups();
    const handleLoadTemplate = (template: Template) => () => {
        dispatch(loadTemplate(template.actionPayload))
        dispatch(cleanExampleList());
        handleTemplateDialogClose();
    };

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        if (event.target === undefined) {
            return;
        }
        if (event.target!.result === undefined) {
            return;
        }
        const template: LoadTemplateFromFileDataActionPayload = JSON.parse(event.target!.result as string);

        template.stopSymbols = template.stopSymbols.map(symbol => {
            return symbol.split('\n').join('\\n');
        });
        dispatch(loadTemplateFromFileData(template));
        handleTemplateDialogClose();
    };

    return <Dialog
        open={templateDialogOpen}
        onClose={handleTemplateDialogClose}
        aria-labelledby="template-dialog-title"
    >
        <DialogTitle id="template-dialog-title">Load Template</DialogTitle>
        <DialogContent
            className={classes.templateDialog}
        >
            <List>
                <Files
                    className="files-dropzone"
                    onChange={(file: any) => {
                        fileReader.readAsText(file[0]);
                    }}
                    onError={(err: any) => console.log(err)}
                    accepts={['.json']}
                    maxFileSize={10000000}
                    minFileSize={0}
                    clickable
                >
                    <ListItem button><ListItemIcon><FolderOpenIcon/></ListItemIcon><ListItemText>From
                        file</ListItemText></ListItem>
                </Files>
            </List>
            {templateGroups.map((templateGroup, ind) => (
                <div key={ind}>
                    <List subheader={<ListSubheader>{templateGroup.name}</ListSubheader>}>
                        {templateGroup.templates.map(template => (
                            <ListItem key={template.id} button
                                      onClick={handleLoadTemplate(template)}><ListItemText>{template.name}</ListItemText></ListItem>
                        ))}
                    </List>
                </div>
            ))}

        </DialogContent>
        <DialogActions>
            <Button onClick={handleTemplateDialogClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>;
}