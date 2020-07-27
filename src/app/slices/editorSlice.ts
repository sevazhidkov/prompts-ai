import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from "lodash";
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

export interface LoadTemplateActionPayload {
    prompt: string;
    exampleTexts: Array<string>;
}

interface EditorState {
    prompt: string;
    apiKey?: string;
    examples: Array<Example>;
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
    apiKey: undefined,
    examples: [
        {id: uniqueId("input_"), text: "We all eat the fish and then made dessert.", output: "We all ate the fish and then made dessert.", isLoading: false},
        {id: uniqueId("input_"), text: "I like ski every day.", output: "I like skiing every day.", isLoading: false},
        ]
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
                state.examples.push({id: uniqueId("input_"), text: "", output: undefined, isLoading: false});
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

        loadTemplate: (state, action: PayloadAction<LoadTemplateActionPayload>) => {
            state.prompt = action.payload.prompt;
            state.examples = action.payload.exampleTexts.map((exampleText) => {
                return {id: uniqueId('example_'), text: exampleText, output: undefined, isLoading: false}
            });
        },
        editPrompt: (state, action: PayloadAction<string>) => {
            state.prompt = action.payload;
        },
        editApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload;
        }
    },
});

export const { editExample, loadOutputForExample, cleanExampleList, markExampleAsLoading, loadTemplate, editPrompt, editApiKey } = editorSlice.actions;

export const fetchExamplesOutputsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (state.editor.apiKey === undefined) {
        alert('Enter an API key before running requests.');
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
            "max_tokens": 100,
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

export const selectPrompt = (state: RootState) => state.editor.prompt;
export const selectExamples = (state: RootState) => state.editor.examples;
export const selectApiKey = (state: RootState) => state.editor.apiKey;

export default editorSlice.reducer;
