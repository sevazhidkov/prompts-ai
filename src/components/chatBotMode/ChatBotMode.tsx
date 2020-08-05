import React from "react";
import {Box, Grid} from "@material-ui/core";
import Conversation from "../conversation/Conversation";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    gridItem: {
        width: '100%',
    },
});

export default function ChatBotMode() {
    const styles = useStyles();
    return <Box>
        <Grid container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={1}>
            <Grid item className={styles.gridItem}>
                <Conversation/>
            </Grid>
        </Grid>
    </Box>;
}