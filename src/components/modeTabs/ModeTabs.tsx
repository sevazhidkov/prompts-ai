import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExampleModeTab from "../exampleModeTab/ExampleModeTab";
import CreativeModeTab from '../creativeModTab/CreativeModeTab';
import {useDispatch, useSelector} from "react-redux";
import {selectTabIndex, updateTabIndex} from "../../app/slices/editorSlice";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    instructionCard: {
        backgroundColor: theme.palette.background.default
    }
}));

export default function ModeTabs() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const tabIndex = useSelector(selectTabIndex);

    const handleTabIndexChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        dispatch(updateTabIndex(newValue));
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={tabIndex} onChange={handleTabIndexChange} aria-label="simple tabs example">
                    <Tab label="Multiple Examples" {...a11yProps(0)} />
                    <Tab label="Creative Generation" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
                <ExampleModeTab/>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <CreativeModeTab/>
            </TabPanel>
        </div>
    );
}