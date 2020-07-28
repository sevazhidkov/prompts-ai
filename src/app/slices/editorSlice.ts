import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniqid from "uniqid";
import axios from "axios";
import {AppThunk, RootState} from "../store";
import {ChoiceResult} from "../../libs/gptClient";

interface Example {
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
}

interface EditExampleActionPayload {
    id: string;
    text: string;
}

interface LoadExampleOutputActionPayload {
    id: string;
    output: string;
}

interface CreativeCompletion {
    id: string;
    prompt: string;
    output: string;
    temperature: number;
    maxTokens: number;
}

interface AddCreativeCompletionActionPayload {
    output: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
}

export interface LoadTemplateActionExample {
    text: string;
    output: string;
}

export interface LoadTemplateActionPayload {
    prompt: string;
    examples: Array<LoadTemplateActionExample>;
}

interface EditorState {
    prompt: string;
    apiKey?: string;
    temperature: number;
    maxTokens: number;
    tabIndex: number;

    examples: Array<Example>;

    loadingCreativeCompletions: boolean;
    creativeCompletions: Array<CreativeCompletion>;
    maxCreativeCompletions: number;
    showPromptForCreativeCompletions: boolean;
}
///
// Output: Anna and Mike are going skiing.
// Input: Anna and Pat are married; he has been together for 20 years.
// Output: Anna and Pat are married; they have been together for 20 years.
// Input: I walk to the store and I bought milk.
// Output: I walked to the store and I bought milk.
// Input: We all eat the fish and then made dessert.
const initialState: EditorState = {
    prompt: "Input: Anna and Mike is going skiing.\n" +
        "Output: Anna and Mike are going skiing.\n" +
        "Input: Anna and Pat are married; he has been together for 20 years.\n" +
        "Output: Anna and Pat are married; they have been together for 20 years.\n" +
        "Input: I walk to the store and I bought milk.\n" +
        "Output: I walked to the store and I bought milk.\n" +
        "Input: {example}\n" +
        "Output:",
    temperature: 0.5,
    maxTokens: 30,
    apiKey: undefined,
    tabIndex: 0,

    examples: [
        {id: uniqid("input_"), text: "We all eat the fish and then made dessert.", output: "We all ate the fish and then made dessert.", isLoading: false},
        {id: uniqid("input_"), text: "I like ski every day.", output: "I like skiing every day.", isLoading: false},
        ],

    loadingCreativeCompletions: false,
    creativeCompletions: [],
    maxCreativeCompletions: 10,
    showPromptForCreativeCompletions: true,
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        editExample: (state, action: PayloadAction<EditExampleActionPayload>) => {
            state.examples = state.examples.map(value => {
                if (value.id === action.payload.id) {
                    value.text = action.payload.text;
                }
                return value;
            });
        },
        cleanExampleList: (state) => {
            // Always add an empty example for user to fill out
            if (state.examples.length < 1 || state.examples[state.examples.length - 1].text.length) {
                state.examples.push({id: uniqid("input_"), text: "", output: undefined, isLoading: false});
            }
            // Delete all empty inputs except for the last one
            state.examples = state.examples.filter((value, index) => {
                if (index === state.examples.length - 1) {
                    return true;
                }
                return value.text.length > 0;
            })
        },
        markExampleAsLoading: (state, action: PayloadAction<string>) => {
            state.examples = state.examples.map(value => {
                if (value.id === action.payload) {
                    value.isLoading = true;
                }
                return value;
            });
        },
        loadOutputForExample: (state, action: PayloadAction<LoadExampleOutputActionPayload>) => {
            state.examples = state.examples.map(value => {
                if (value.id === action.payload.id) {
                    value.output = action.payload.output;
                    value.isLoading = false;
                }
                return value;
            });
        },
        deleteExample: (state, action: PayloadAction<string>) => {
            state.examples = state.examples.filter(example => example.id !== action.payload);
        },

        updateCreativeCompletionsLoadingStatus: (state, action: PayloadAction<boolean>) => {
            state.loadingCreativeCompletions = action.payload;
        },
        addCreativeCompletion: (state, action: PayloadAction<AddCreativeCompletionActionPayload>) => {
            state.creativeCompletions.push({
                id: uniqid('completion_'),
                output: action.payload.output,
                prompt: action.payload.prompt,
                temperature: action.payload.temperature,
                maxTokens: action.payload.maxTokens,
            });
        },
        editMaxCreativeCompletions: (state, action: PayloadAction<number>) => {
            state.maxCreativeCompletions = action.payload;
        },
        cleanCreativeCompletions: (state) => {
            state.creativeCompletions = [];
        },
        updateShowPromptForCreativeCompletions: (state, action: PayloadAction<boolean>) => {
            state.showPromptForCreativeCompletions = action.payload;
        },

        loadTemplate: (state, action: PayloadAction<LoadTemplateActionPayload>) => {
            state.prompt = action.payload.prompt;
            state.examples = action.payload.examples.map((example) => {
                return {id: uniqid('example_'), text: example.text, output: example.output, isLoading: false}
            });
        },
        editPrompt: (state, action: PayloadAction<string>) => {
            state.prompt = action.payload;
        },
        editApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload;
        },
        editTemperature: (state, action: PayloadAction<number>) => {
            state.temperature = action.payload;
        },
        editMaxTokens: (state, action: PayloadAction<number>) => {
            state.maxTokens = action.payload;
        },
        updateTabIndex: (state, action: PayloadAction<number>) => {
            state.tabIndex = action.payload;
        }
    },
});

export const { editExample, loadOutputForExample, deleteExample, cleanExampleList, markExampleAsLoading,
    addCreativeCompletion, editMaxCreativeCompletions, cleanCreativeCompletions, updateShowPromptForCreativeCompletions,
    updateCreativeCompletionsLoadingStatus,
    loadTemplate, editPrompt, editApiKey, editTemperature, editMaxTokens, updateTabIndex } = editorSlice.actions;

export const fetchExamplesOutputsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (state.editor.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (state.editor.prompt.length === 0) {
        alert("Prompts can't be empty");
        return;
    }
    if (state.editor.prompt.indexOf('{example}') === -1) {
        alert('Use "{example"} in your prompt to use the Multiple Examples mode');
        return;
    }

    const text = state.editor.prompt;
    const examples = state.editor.examples.filter(example => example.text.length > 0);
    const examplePrompts = examples.map(example => text.replace('{example}', example.text));
    const exampleIds = examples.map(example => example.id);

    exampleIds.map((exampleId) => dispatch(markExampleAsLoading(exampleId)));

    axios({
        method: "POST",
        url: `https://api.openai.com/v1/engines/davinci/completions`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.editor.apiKey}`,
        },
        data: {
            "prompt": examplePrompts,
            "max_tokens": state.editor.maxTokens,
            "temperature": state.editor.temperature,
            "stop": "\n"
        }
    }).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        response.choices.map((exampleResult: ChoiceResult, ind: number) => {
             const exampleId = exampleIds[ind];
             dispatch(loadOutputForExample({id: exampleId, output: exampleResult.text}));
             return undefined;
        });
    });

    //setTimeout(() => {
    //    dispatch(incrementByAmount(amount));
    //}, 1000);
};

export const fetchCreativeCompletionsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (state.editor.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (state.editor.prompt.length === 0) {
        alert("Prompts can't be empty");
        return;
    }

    dispatch(updateCreativeCompletionsLoadingStatus(true));

    const text = state.editor.prompt;
    const temperature = state.editor.temperature;
    const maxTokens = state.editor.maxTokens

    axios({
        method: "POST",
        url: `https://api.openai.com/v1/engines/davinci/completions`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.editor.apiKey}`,
        },
        data: {
            "prompt": Array(state.editor.maxCreativeCompletions).fill(text),
            "temperature": temperature,
            "max_tokens": maxTokens,
            "stop": ""
        }
    }).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        dispatch(updateCreativeCompletionsLoadingStatus(false));
        response.choices.map((creativeCompletionResult: ChoiceResult) => (
            dispatch(addCreativeCompletion({
                output: creativeCompletionResult.text,
                prompt: text,
                temperature: temperature,
                maxTokens: maxTokens
            }))
        ));
    });
}


export const selectTabIndex = (state: RootState) => state.editor.tabIndex;
export const selectPrompt = (state: RootState) => state.editor.prompt;
export const selectExamples = (state: RootState) => state.editor.examples;
export const selectCreativeCompletionsLoadingStatus = (state: RootState) => state.editor.loadingCreativeCompletions;
export const selectCreativeCompletions = (state: RootState) => state.editor.creativeCompletions;
export const selectMaxCreativeCompletions = (state: RootState) => state.editor.maxCreativeCompletions;
export const selectShowPromptForCreativeCompletions = (state: RootState) => state.editor.showPromptForCreativeCompletions;
export const selectApiKey = (state: RootState) => state.editor.apiKey;
export const selectTemperature = (state: RootState) => state.editor.temperature;
export const selectMaxTokens = (state: RootState) => state.editor.maxTokens;

export default editorSlice.reducer;
