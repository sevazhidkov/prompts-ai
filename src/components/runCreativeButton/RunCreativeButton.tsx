import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, CircularProgress} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import {fetchCreativeCompletionsAsync, selectCreativeCompletionsLoadingStatus} from "../../app/slices/editorSlice";

const useStyles = makeStyles(
    createStyles({
        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);

export default function RunCreativeButton() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const isLoading = useSelector(selectCreativeCompletionsLoadingStatus);
    const fetchOutputs = () => {
        dispatch(fetchCreativeCompletionsAsync());
    };
    return (
        <Button variant="contained" size="large" color="primary" onClick={fetchOutputs}
                disabled={isLoading}
        >{isLoading && (
            <CircularProgress size={24} className={styles.buttonProgress}/>
        )} Generate</Button>
    );
}