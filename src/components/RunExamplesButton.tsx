import React from 'react';
import {useDispatch} from "react-redux";
import {fetchExamplesOutputsAsync} from "../app/slices/editorSlice";
import { Button } from '@material-ui/core';

export default function RunExamplesButton() {
    const dispatch = useDispatch();
    const fetchOutputs = () => {
        dispatch(fetchExamplesOutputsAsync());
    };
    return (
        <Button variant="contained" size="large" color="primary" onClick={fetchOutputs}>Run</Button>
    );
}