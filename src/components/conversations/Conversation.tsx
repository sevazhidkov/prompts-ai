import React, {createRef, useEffect} from "react";
import {Card, CardActions, CardContent, Typography, TextField, Grid, Box, Paper, AccordionDetails, AccordionSummary, Accordion, IconButton} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { RootState } from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {
    ConversationPartSource,
    selectPrompt,
    deleteConversation, selectCompletionParameters, updateConversationRestartSequence, updateConversationStartSequence,
} from "../../slices/editorSlice";
import {Delete} from "@material-ui/icons";
import CompletionParameters from "./CompletionParameters";
import Input from "./Input";

interface Props {
    id: string;
    ind: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
    },
    settingField: {
        minWidth: '250px',
    },
    generatedText: {
        whiteSpace: 'pre-line',
        display: 'inline',
        fontWeight: 800,
    },
    promptedText: {
        whiteSpace: 'pre-line',
        display: 'inline',
        fontWeight: 400,
    },
    conversationBox: {
        minHeight: '400px',
        maxHeight: '400px',
        overflowY: 'scroll'
    },
    responseInput: {
        width: '100%'
    }
}));

export default function Conversation(props: Props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const prompt = useSelector(selectPrompt);
    const globalCompletionParameters = useSelector(selectCompletionParameters);
    const conversation = useSelector((state: RootState) => {
        const workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
        return workspace.conversations.find(c => c.id === props.id)!;
    });

    const hasStarted = conversation.parts.some(c => c.submitted);

    useEffect(() => {
        conversationBottom.current!.scrollTop = conversationBottom.current!.scrollHeight;
    });

    const conversationBottom = createRef<HTMLDivElement>();

    return <Card className={styles.card}>
        <CardContent>
            <Grid container alignItems={'center'} justify={'space-between'}>
                <Grid item><Typography>
                    {!hasStarted && (
                        "New Conversation"
                    )}
                    {hasStarted && (
                        <Box>
                            <Typography component={'span'}>Conversation #{props.ind}</Typography><br/>
                            <Typography variant={'caption'} component={'span'}>The prompt and parameters are locked.</Typography>
                        </Box>
                    )}
                </Typography></Grid>
                <Grid item>
                    {hasStarted && (
                        <IconButton onClick={() => {
                            dispatch(deleteConversation(props.id));
                        }}>
                            <Delete />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
            <Box mt={1} className={styles.conversationBox}>
                <Paper className={styles.conversationBox} ref={conversationBottom}>
                    <Box ml={1} mt={1}>
                        {hasStarted && (<>
                            <Typography component={'span'} className={styles.promptedText}>{conversation.initialPrompt}</Typography>
                                {conversation.parts.map(part => (<>
                                    {part.source === ConversationPartSource.gpt && <Typography component={'span'} className={styles.generatedText}>{part.text}</Typography>}
                                    {part.source === ConversationPartSource.user && <Typography component={'span'} className={styles.promptedText}>{part.text}</Typography>}
                                </>))}
                        </>)}
                        {!hasStarted && (<>
                            <Typography component={'span'} className={styles.promptedText}>{prompt}</Typography>
                            <Typography component={'span'} className={styles.promptedText}>{conversation.restartSequence}</Typography>
                        </>)}
                        <div />
                    </Box>
                </Paper>
            </Box>
            <Box mt={2} className={styles.responseInput}>
                <Input conversationId={props.id} afterSend={() => {
                    conversationBottom.current!.scrollTop = conversationBottom.current!.scrollHeight;
                }}/>
            </Box>
            <Box mt={1}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Parameters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <TextField
                                        value={conversation.restartSequence.split('\n').join('\\n')}
                                        onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            dispatch(updateConversationRestartSequence({
                                                conversationId: props.id,
                                                restartSequence: event.currentTarget.value.split('\\n').join('\n')
                                            }));
                                        }}
                                        className={styles.settingField}
                                        label={'Before User Input'}
                                        variant={'outlined'}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        value={conversation.startSequence.split('\n').join('\\n')}
                                        onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            dispatch(updateConversationStartSequence({
                                                conversationId: props.id,
                                                startSequence: event.currentTarget.value.split('\\n').join('\n')
                                            }));
                                        }}
                                        className={styles.settingField}
                                        label={'Before GPT-3 Completion'}
                                        variant={'outlined'}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={1}>
                                {conversation.completionParams === undefined && (
                                    <CompletionParameters parameters={globalCompletionParameters} />
                                )}
                                {conversation.completionParams !== undefined && (
                                    <CompletionParameters parameters={conversation.completionParams} />
                                )}
                            </Box>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

        </CardContent>
        <CardActions>
        </CardActions>
    </Card>;
}
