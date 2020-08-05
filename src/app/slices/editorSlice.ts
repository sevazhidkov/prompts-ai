import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniqid from "uniqid";
import {AppThunk, RootState} from "../store";
import {ChoiceResult, completeWithGpt} from "../../libs/gptClient";

export interface Example {
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
    previousOutput?: string;
}

export interface CompletionParameters {
    apiKey: string;
    engine: string;
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
}

export enum TabIndex {
    multipleExamples = 0,
    creativeGeneration
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
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

interface AddCreativeCompletionActionPayload {
    output: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

export interface LoadTemplateFromFileDataActionPayload {
    prompt: string;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    maxTokens: number;
    stopSymbols: Array<string>;
    modelName: string;
}

export interface LoadTemplateActionExample {
    text: string;
    output: string;
}

export interface LoadTemplateActionPayload {
    prompt: string;
    examples: Array<LoadTemplateActionExample>;
    stopSymbols?: Array<string>;
    tabIndex: number;
}

interface EditorState {
    prompt: string;
    apiKey?: string;
    modelName: string;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    stopSymbols: Array<string>;
    maxTokens: number;
    tabIndex: TabIndex;

    showExamplePreviousOutputs: boolean;
    examples: Array<Example>;

    loadingCreativeCompletions: boolean;
    creativeCompletions: Array<CreativeCompletion>;
    maxCreativeCompletions: number;
    showPromptForCreativeCompletions: boolean;
}

const initialState: EditorState = {
    prompt: "Input: Anna and Mike is going skiing.\n" +
        "Output: Anna and Mike are going skiing.\n" +
        "Input: Anna and Pat are married; he has been together for 20 years.\n" +
        "Output: Anna and Pat are married; they have been together for 20 years.\n" +
        "Input: I walk to the store and I bought milk.\n" +
        "Output: I walked to the store and I bought milk.\n" +
        "Input: {example}\n" +
        "Output:",
    modelName: 'davinci',
    temperature: 0.5,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    stopSymbols: ["\\n"],
    maxTokens: 30,
    apiKey: undefined,
    tabIndex: 0,

    showExamplePreviousOutputs: false,
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
        markAllExamplesAsNotLoading: (state) => {
            state.examples = state.examples.map(value => {
                value.isLoading = false;
                return value;
            });
        },
        loadOutputForExample: (state, action: PayloadAction<LoadExampleOutputActionPayload>) => {
            state.examples = state.examples.map(value => {
                if (value.id === action.payload.id) {
                    value.previousOutput = value.output;
                    value.output = action.payload.output;
                    value.isLoading = false;
                }
                return value;
            });
        },
        deleteExample: (state, action: PayloadAction<string>) => {
            state.examples = state.examples.filter(example => example.id !== action.payload);
        },
        updateExamplePreviousOutputsStatus: (state, action: PayloadAction<boolean>) => {
            state.showExamplePreviousOutputs = action.payload;
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
                topP: action.payload.topP,
                frequencyPenalty: action.payload.frequencyPenalty,
                presencePenalty: action.payload.presencePenalty,
                modelName: action.payload.modelName,
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

            if (action.payload.stopSymbols !== undefined) {
                state.stopSymbols = action.payload.stopSymbols;
            }
            state.tabIndex = action.payload.tabIndex;
        },
        loadTemplateFromFileData: (state, action: PayloadAction<LoadTemplateFromFileDataActionPayload>) => {
            state.prompt = action.payload.prompt;
            state.temperature = action.payload.temperature;
            state.topP = action.payload.topP;
            state.frequencyPenalty = action.payload.frequencyPenalty;
            state.presencePenalty = action.payload.presencePenalty;
            state.maxTokens = action.payload.maxTokens;
            state.stopSymbols = action.payload.stopSymbols;
            state.modelName = action.payload.modelName;
        },
        editPrompt: (state, action: PayloadAction<string>) => {
            state.prompt = action.payload;
        },
        editApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload;
        },
        editModelName: (state, action: PayloadAction<string>) => {
            state.modelName = action.payload;
        },
        editTemperature: (state, action: PayloadAction<number>) => {
            state.temperature = action.payload;
        },
        editTopP: (state, action: PayloadAction<number>) => {
            state.topP = action.payload;
        },
        editFrequencyPenalty: (state, action: PayloadAction<number>) => {
            state.frequencyPenalty = action.payload;
        },
        editPresencePenalty: (state, action: PayloadAction<number>) => {
            state.presencePenalty = action.payload;
        },
        addStopSymbol: (state, action: PayloadAction<string>) => {
            state.stopSymbols.push(action.payload);
        },
        deleteStopSymbol: (state, action: PayloadAction<string>) => {
            state.stopSymbols = state.stopSymbols.filter((symbol) => symbol !== action.payload);
        },
        editMaxTokens: (state, action: PayloadAction<number>) => {
            state.maxTokens = action.payload;
        },
        updateTabIndex: (state, action: PayloadAction<number>) => {
            state.tabIndex = action.payload;
        }
    },
});

export const { editExample, loadOutputForExample, deleteExample, cleanExampleList, markExampleAsLoading, updateExamplePreviousOutputsStatus,
    markAllExamplesAsNotLoading,
    addCreativeCompletion, editMaxCreativeCompletions, cleanCreativeCompletions, updateShowPromptForCreativeCompletions,
    updateCreativeCompletionsLoadingStatus,
    addStopSymbol, deleteStopSymbol,
    editTopP, editFrequencyPenalty, editPresencePenalty,
    loadTemplate, loadTemplateFromFileData,
    editPrompt, editApiKey, editModelName, editTemperature, editMaxTokens, updateTabIndex } = editorSlice.actions;

export const fetchForCurrentTab = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    switch (state.editor.present.tabIndex) {
        case TabIndex.multipleExamples: {
            dispatch(fetchExamplesOutputsAsync());
            break;
        }
        case TabIndex.creativeGeneration: {
            dispatch(fetchCreativeCompletionsAsync());
            break;
        }
    }
}

export const fetchExamplesOutputsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (state.editor.present.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (state.editor.present.prompt.length === 0) {
        alert("Prompts can't be empty");
        return;
    }
    if (state.editor.present.prompt.indexOf('{example}') === -1) {
        alert('Use "{example"} in your prompt to use the Multiple Examples mode');
        return;
    }

    const examples = state.editor.present.examples.filter(example => example.text.length > 0);
    if (examples.length === 0) {
        alert('Enter at least one example');
        return;
    }

    const completionParams = selectCompletionParameters(state);
    const examplePrompts = examples.map(example => completionParams.prompt.replace('{example}', example.text));
    const exampleIds = examples.map(example => example.id);
    exampleIds.map((exampleId) => dispatch(markExampleAsLoading(exampleId)));

    completeWithGpt(examplePrompts, completionParams).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        response.choices.map((exampleResult: ChoiceResult, ind: number) => {
             const exampleId = exampleIds[ind];
             dispatch(loadOutputForExample({id: exampleId, output: exampleResult.text}));
             return undefined;
        });
    }).catch(error => {
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error.response);
        dispatch(markAllExamplesAsNotLoading());
    });
};

export const fetchCreativeCompletionsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    if (state.editor.present.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (state.editor.present.prompt.length === 0) {
        alert("Prompts can't be empty");
        return;
    }

    dispatch(updateCreativeCompletionsLoadingStatus(true));

    const completionParams = selectCompletionParameters(state);

    completeWithGpt(completionParams.prompt, completionParams, state.editor.present.maxCreativeCompletions).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        dispatch(updateCreativeCompletionsLoadingStatus(false));
        response.choices.map((creativeCompletionResult: ChoiceResult) => (
            dispatch(addCreativeCompletion({
                output: creativeCompletionResult.text,
                prompt: completionParams.prompt,
                temperature: completionParams.temperature,
                maxTokens: completionParams.maxTokens,
                topP: completionParams.topP,
                presencePenalty: completionParams.presencePenalty,
                frequencyPenalty: completionParams.frequencyPenalty,
                modelName: completionParams.engine
            }))
        ));
    }).catch(error => {
        alert('API returned an error. Refer to the console to inspect it.')
        console.log(error.response);
        dispatch(updateCreativeCompletionsLoadingStatus(false));
    });
}


export const selectTabIndex = (state: RootState) => state.editor.present.tabIndex;
export const selectPrompt = (state: RootState) => state.editor.present.prompt;
export const selectStopSymbols = (state: RootState) => state.editor.present.stopSymbols;
export const selectExamples = (state: RootState) => state.editor.present.examples;
export const selectExamplePreviousOutputsStatus = (state: RootState) => state.editor.present.showExamplePreviousOutputs;
export const selectCreativeCompletionsLoadingStatus = (state: RootState) => state.editor.present.loadingCreativeCompletions;
export const selectCreativeCompletions = (state: RootState) => state.editor.present.creativeCompletions;
export const selectMaxCreativeCompletions = (state: RootState) => state.editor.present.maxCreativeCompletions;
export const selectShowPromptForCreativeCompletions = (state: RootState) => state.editor.present.showPromptForCreativeCompletions;
export const selectApiKey = (state: RootState) => state.editor.present.apiKey;
export const selectModelName = (state: RootState) => state.editor.present.modelName;
export const selectTemperature = (state: RootState) => state.editor.present.temperature;
export const selectTopP = (state: RootState) => state.editor.present.topP;
export const selectFrequencyPenalty = (state: RootState) => state.editor.present.frequencyPenalty;
export const selectPresencePenalty = (state: RootState) => state.editor.present.presencePenalty;
export const selectMaxTokens = (state: RootState) => state.editor.present.maxTokens;
export const selectCompletionParameters = (state: RootState) => ({
    apiKey: state.editor.present.apiKey === undefined ? '' : state.editor.present.apiKey,
    engine: state.editor.present.modelName,
    maxTokens: state.editor.present.maxTokens,
    stop: (() => {
        if (state.editor.present.stopSymbols.length > 0) {
            return state.editor.present.stopSymbols.map(symbol => {
                return symbol.split('\\n').join('\n');
            });
        } else {
            return '';
        }
    })(),
    prompt: state.editor.present.prompt,
    temperature: state.editor.present.temperature,
    topP: state.editor.present.topP,
    presencePenalty: state.editor.present.presencePenalty,
    frequencyPenalty: state.editor.present.frequencyPenalty,
});

export default editorSlice.reducer;
