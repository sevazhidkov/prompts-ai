import React from 'react';
import {Grid, Hidden, AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ExampleModeTab from "./ExampleModeTab";
import VariationsTab from './VariationsTab';
import {useDispatch, useSelector} from "react-redux";
import {selectTabIndex, updateTabIndex, TabIndex} from "../slices/editorSlice";
import CodeGeneratorButton from './CodeGeneratorButton';
import ConversationsMode from './ConversationsMode';

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
    },
    additionalItemsGridItem: {
        marginRight: "10px",
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
                <Grid
                    justify="space-between" // Add it here :)
                    alignItems="center"
                    container
                    spacing={1}
                >
                    <Grid item>
                        <Tabs value={tabIndex} onChange={handleTabIndexChange} aria-label="simple tabs example">
                            <Tab label="Examples" {...a11yProps(TabIndex.multipleExamples)} />
                            <Tab label="Variations" {...a11yProps(TabIndex.variations)} />
                        </Tabs>
                    </Grid>
                    <Hidden smDown>
                        <Grid item className={classes.additionalItemsGridItem}>
                            <CodeGeneratorButton/>
                        </Grid>
                    </Hidden>
                </Grid>
            </AppBar>
            <TabPanel value={tabIndex} index={TabIndex.multipleExamples}>
                <ExampleModeTab/>
            </TabPanel>
            <TabPanel value={tabIndex} index={TabIndex.variations}>
                <VariationsTab/>
            </TabPanel>
            <TabPanel value={tabIndex} index={TabIndex.chatBot}>
                <ConversationsMode/>
            </TabPanel>
        </div>
    );
}