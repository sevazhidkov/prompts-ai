import React from "react";
import {Card, CardActions, CardContent, Typography, TextField, Grid, Box} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
    },
    settingField: {
        minWidth: '250px',
    },
    generatedText: {
        fontWeight: 800,
    },
    promptedText: {
        fontWeight: 400,
    }
}));

export default function Conversation() {
    const styles = useStyles();
    return <Card className={styles.card}>
        <CardContent>
            <Box mb={1}>
                <Typography>Conversation Settings</Typography>
            </Box>
            <Grid container spacing={1}>
                <Grid item><TextField className={styles.settingField} label={'Before User Input'} variant={'outlined'}/></Grid>
                <Grid item><TextField className={styles.settingField} label={'Before GPT-3 Completion'} variant={'outlined'}/></Grid>
            </Grid>
            <hr/>
            <Box mt={1}>
                <Typography className={styles.generatedText}>The following is a conversation of a user with AI. AI is friendly, polite and smart.</Typography>
                <Typography className={styles.generatedText}>AI: Hello, how are you?</Typography>
                <Typography className={styles.promptedText}>User: Good, what about you?</Typography>
            </Box>
        </CardContent>
        <CardActions>
            <TextField label={'Your Response'} variant={'outlined'} />
        </CardActions>
    </Card>;
}
