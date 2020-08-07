import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import generateCodeExamples from '../../libs/codeGenerator';
import {useSelector} from "react-redux";
import {selectExamples, selectTabIndex, selectCompletionParameters} from "../../app/slices/editorSlice";
import { Box, Theme, IconButton, FormControl, Select } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    fullWidth: {
        width: '100%',
    }
}));


export default function CodeGeneratorButton() {
    const classes = useStyles();

    const completionParameters = useSelector(selectCompletionParameters);
    const tabIndex = useSelector(selectTabIndex);
    const examples = useSelector(selectExamples);

    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    let defaultExampleId;
    const codeExamples = generateCodeExamples(completionParameters, tabIndex, examples);
    if (codeExamples.length === 0) {
        defaultExampleId = '';
    } else {
        defaultExampleId = codeExamples[0].id;
    }

    const [selectedExample, setExample] = React.useState(defaultExampleId);
    const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setExample(event.target.value as string);
    }

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen('paper')}>Generate Code</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle id="scroll-dialog-title">
                    Code Generator
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <FormControl className={classes.fullWidth}>
                            <Select
                                native
                                value={selectedExample}
                                onChange={handleSelectChange}
                                className={classes.fullWidth}>
                            >
                                {generateCodeExamples(completionParameters, tabIndex, examples).map((codeExample) => (
                                    <option key={codeExample.id} value={codeExample.id}>{codeExample.name}</option>
                                ))}
                            </Select>
                        </FormControl>

                        {generateCodeExamples(completionParameters, tabIndex, examples)
                            .filter((codeExample) => codeExample.id === selectedExample)
                            .map((codeExample) => (
                            <Box key={codeExample.id}>
                                <SyntaxHighlighter language={codeExample.language}>
                                    {codeExample.text}
                                </SyntaxHighlighter>
                            </Box>
                        ))}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}