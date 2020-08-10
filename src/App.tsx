import React from 'react';
import { PromptEditor } from './components/promptEditor/PromptEditor';
import './App.css';
import {
    createMuiTheme,
    CssBaseline,
    Typography,
    ThemeProvider,
    Container,
    Box, Link,
} from "@material-ui/core";
import {useHotkeys} from "react-hotkeys-hook";
import {useDispatch} from "react-redux";
import ModeTabs from "./components/modeTabs/ModeTabs";
import {updateTabIndex, fetchForCurrentTab} from "./app/slices/editorSlice";


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
            {/*
            <AppBar position="static">
                <Container maxWidth={"lg"}>
                    <Toolbar variant="regular">
                        <Typography variant="h6" color="inherit">
                            Prompts.ai
                        </Typography>

                        <Typography className={styles.description}>
                            Advanced playground tools for GPT-3
                        </Typography>

                        <div className={styles.apiKey}>
                            <TextField type="password"
                                       label={'API Key'}
                                       variant="outlined"
                                       size={'small'}
                                       value={apiKey}
                                       onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                           dispatch(editApiKey(event.currentTarget.value));
                                       }}
                                       inputProps={{
                                           autoComplete: 'new-password',
                                           form: {
                                               autoComplete: 'off',
                                           },
                                       }}
                            />
                        </div>
                    </Toolbar>
                </Container>
            </AppBar>
            */}
            <Container maxWidth={"lg"}>
                <Box mt={2}>
                    <PromptEditor/>
                </Box>
                <Box mt={2}>
                    <ModeTabs/>
                </Box>
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
