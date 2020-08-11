import React, {useEffect} from "react";
import {Box, Grid} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import Conversation from "./Conversation";
import {selectConversations, normalizeConversations} from "../slices/editorSlice";

const useStyles = makeStyles({
    gridItem: {
        width: '100%',
    },
});

export default function ConversationsMode() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const conversations = useSelector(selectConversations);

    useEffect(() => {
        dispatch(normalizeConversations());
    })

    return <Box>
        <Grid container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={1}>
            {conversations.map(conversation => (
                <Grid item key={conversation.id} className={styles.gridItem}>
                    <Conversation id={conversation.id} />
                </Grid>
            ))}
        </Grid>
    </Box>;
}