import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import ExampleCollection from '../exampleCollection/ExampleCollection';
import RunButton from '../runButton/RunButton';
import {cleanExampleList} from "../../app/slices/editorSlice";
import {Box} from "@material-ui/core";

// cleanExampleList

export default function ExampleModeTab() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(cleanExampleList());
    })

    return (
        <Box>
            <Box mb={1}>
                <RunButton/>
            </Box>
            <ExampleCollection/>
        </Box>
    );
}