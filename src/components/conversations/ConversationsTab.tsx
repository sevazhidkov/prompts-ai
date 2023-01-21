import React from "react";
import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { RootState } from "../../store";

const useStyles = makeStyles({
  gridItem: {
    width: "100%",
  },
});

export default function ConversationsTab() {
  const styles = useStyles();
  const conversationIds = useSelector((state: RootState) => {
    const workspace = state.editor.present.workspaces.find(
      (w) => w.id === state.editor.present.currentWorkspaceId
    )!;
    return workspace.conversations.map((c) => c.id);
  });

  return (
    <Box>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        {conversationIds.map((conversationId, ind) => (
          <Grid item key={conversationId} className={styles.gridItem}>
            <Conversation
              id={conversationId}
              ind={conversationIds.length - ind}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
