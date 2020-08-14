import React from "react";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {
    normalizeConversations,
    sendMessageInConversationAsync,
    updateConversationInputValue
} from "../../slices/editorSlice";

interface Props {
    conversationId: string;
    afterSend: () => void,
}

export default function Input(props: Props) {
    const dispatch = useDispatch();

    const inputValue = useSelector(
        (state: RootState) => {
            const workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
            return workspace.conversations.find(c => c.id === props.conversationId)!.inputValue;
        }
    );
    const hasStarted = useSelector(
        (state: RootState) => {
            const workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
            return workspace.conversations.find(c => c.id === props.conversationId)!.parts.some(c => c.submitted);
        }
    );
    const onSend = () => {
        dispatch(sendMessageInConversationAsync(props.conversationId));
        props.afterSend();
        dispatch(normalizeConversations());
    }

    const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(updateConversationInputValue({conversationId: props.conversationId, inputValue: event.currentTarget.value}));
    }
    return <TextField multiline
                      label={'Message (Ctrl+Enter to send)'}
                      InputLabelProps={{
                          shrink: true,
                      }}
                      placeholder={hasStarted ? 'Your response' : 'Start a conversation'}
                      value={inputValue}
                      onChange={onInputChange}
                      onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
                          if (event.ctrlKey && event.key === 'Enter') {
                              onSend();
                          }
                      }}
                      variant={'outlined'}
                      fullWidth={true}
                      InputProps={{
                          endAdornment: (<InputAdornment position="end">
                              <IconButton edge="end" onClick={onSend}>
                                  <SendIcon />
                              </IconButton>
                          </InputAdornment>)
                      }}
    />;
}