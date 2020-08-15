import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Card, CardContent, Typography, CardActions} from "@material-ui/core";
import {useSelector} from "react-redux";
import {selectShowPromptForVariations} from "../../slices/editorSlice";

interface Props {
    id: string;
    prompt: string;
    output: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        whiteSpace: "pre-line",
},

    prompt: {},

    output: {
        //textDecoration: "underline",
    }
}));

export default function Variation(props: Props) {
    const styles = useStyles();
    const showPromptForVariations = useSelector(selectShowPromptForVariations);

    return <Card className={styles.card}>
        <CardContent>
            { showPromptForVariations && (
                <>
                    <Typography className={styles.prompt}>{props.prompt}</Typography>
                    <span role={"img"} aria-label={"brain"}>🧠️</span>
                    <Typography className={styles.output} component={'span'}><strong>{props.output}</strong></Typography>
                </>
            )}
            { !showPromptForVariations && (
                <>
                    <span role={"img"} aria-label={"brain"}>🧠️</span>
                    <Typography className={styles.output} component={'span'}>{props.output}</Typography>
                </>
            )}
        </CardContent>
        { showPromptForVariations && (
            <CardActions>
                <Typography variant="caption">Temperature: {props.temperature}</Typography>
                <Typography variant="caption">Max tokens: {props.maxTokens}</Typography>
                <Typography variant="caption">Top P: {props.topP}</Typography>
                <Typography variant="caption">Frequency penalty: {props.frequencyPenalty}</Typography>
                <Typography variant="caption">Presence penalty: {props.presencePenalty}</Typography>
                <Typography variant="caption">Model: {props.modelName}</Typography>
            </CardActions>
        )
        }
    </Card>;
}