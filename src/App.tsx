import React from 'react';
import {PromptEditor} from './components/PromptEditor';
import './App.css';
import {Box, Container, createMuiTheme, CssBaseline, Link, ThemeProvider, Typography,} from "@material-ui/core";
import {useHotkeys} from "react-hotkeys-hook";
import {useDispatch} from "react-redux";
import {fetchForCurrentTab, updateTabIndex} from "./app/slices/editorSlice";
import Header from "./components/Header";
import TemplateDialog from "./components/dialogs/TemplateDialog";
import ApiKeyDialog from "./components/dialogs/ApiKeyDialog";

function App() {
    const dispatch = useDispatch();
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });

    useHotkeys('ctrl+enter', () => {
        dispatch(fetchForCurrentTab());
    }, {filter: (v) => {
            console.log(v);
            return true;
        }});
    useHotkeys('ctrl+1', () => {
        dispatch(updateTabIndex(0));
    });
    useHotkeys('ctrl+2', () => {
        dispatch(updateTabIndex(1));
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>

            <ApiKeyDialog/>
            <TemplateDialog/>

            <Header/>

            <Container maxWidth={"lg"}>
                <Box mt={2}>
                    <PromptEditor/>
                </Box>
                {/*<Box mt={2}>
                    <ModeTabs/>
                </Box>*/}
                <Box mt={2}>
                    <Typography>
                        <Link href={'https://www.notion.so/zhidkoffs/Prompts-ai-3efa7261cdc647f596cb11af06695d24'}>Help and shortcuts</Link>.
                        Feedback: seva@zhidkoff.com.</Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
