import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniqid from "uniqid";
import {AppThunk, RootState} from "../store";
import GptAPI, {ChoiceResult} from "../services/GptAPI";

// TODO: This file grew too fast. It needs to be split into separate slices for different modes.

// State

interface Example {
    id: string;
    text: string;
    isLoading: boolean;
    output?: string;
    previousOutput?: string;
}

interface CompletionParameters {
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

enum TabIndex {
    multipleExamples = 0,
    variations,
    conversations
}

interface Variation {
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

enum ConversationPartSource {
    user = 'user',
    gpt = 'gpt'
}

interface ConversationPart {
    source: ConversationPartSource;
    text: string;
    submitted: boolean;
}

interface ConversationCompletionParameters {
    engine: string;
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
}

interface Conversation {
    id: string;
    initialPrompt?: string;
    inputValue: string;
    isLoading: boolean;
    startSequence: string;
    restartSequence: string;
    parts: Array<ConversationPart>;
    completionParams?: ConversationCompletionParameters;
}

interface Workspace {
    id: string;

    prompt: string;
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

    loadingVariations: boolean;
    variations: Array<Variation>;
    maxVariations: number;
    showPromptForVariations: boolean;

    conversations: Array<Conversation>;
}

interface EditorState {
    apiKey?: string;
    currentWorkspaceId: string;
    workspaces: Array<Workspace>;

    showApiKeyDialog: boolean;
    showTemplateDialog: boolean;
}

const initialState: EditorState = {
    apiKey: undefined,
    currentWorkspaceId: 'first_workspace',
    workspaces: [{
        id: 'first_workspace',
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
        tabIndex: 0,

        showExamplePreviousOutputs: false,
        examples: [
            {id: uniqid("input_"), text: "We all eat the fish and then made dessert.", output: "We all ate the fish and then made dessert.", isLoading: false},
            {id: uniqid("input_"), text: "I like ski every day.", output: "I like skiing every day.", isLoading: false},
        ],

        loadingVariations: false,
        variations: [],
        maxVariations: 10,
        showPromptForVariations: true,

        conversations: [],
    }],
    showApiKeyDialog: false,
    showTemplateDialog: false,
};

// Action Payloads: Examples

interface EditExampleActionPayload {
    id: string;
    text: string;
}

interface LoadExampleOutputActionPayload {
    id: string;
    output: string;
}

// Action Payloads: Variations

interface AddVariationActionPayload {
    output: string;
    prompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    modelName: string;
}

// Action Payloads: Conversations

interface SetConversationCompletionParametersActionPayload {
    conversationId: string;
    parameters: ConversationCompletionParameters;
}

interface SetConversationInitialPromptActionPayload {
    conversationId: string;
    initialPrompt: string;
}

interface UpdateConversationLoadingStatusActionPayload {
    conversationId: string;
    status: boolean;
}

interface UpdateConversationInputValueActionPayload {
    conversationId: string;
    inputValue: string;
}

interface UpdateConversationStartSequenceActionPayload {
    conversationId: string;
    startSequence: string;
}

interface UpdateConversationRestartSequenceActionPayload {
    conversationId: string;
    restartSequence: string;
}


interface AddMessageToConversationFromUserActionPayload {
    conversationId: string;
    source: ConversationPartSource.user;
}

interface AddMessageToConversationFromGptActionPayload {
    conversationId: string;
    text: string;
    source: ConversationPartSource.gpt;
}

// Action Payloads: Templates

interface LoadTemplateFromFileDataActionPayload {
    prompt: string;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    maxTokens: number;
    stopSymbols: Array<string>;
    modelName: string;
}

interface LoadTemplateActionExample {
    text: string;
    output: string;
}

interface LoadTemplateActionPayload {
    prompt: string;
    examples: Array<LoadTemplateActionExample>;
    stopSymbols?: Array<string>;
    tabIndex: number;
}

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        editExample: (state, action: PayloadAction<EditExampleActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.examples = workspace.examples.map(value => {
                if (value.id === action.payload.id) {
                    value.text = action.payload.text;
                }
                return value;
            });
        },
        cleanExampleList: (state) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            // Always add an empty example for user to fill out
            if (workspace.examples.length < 1 || workspace.examples[workspace.examples.length - 1].text.length) {
                workspace.examples.push({id: uniqid("input_"), text: "", output: undefined, isLoading: false});
            }
            // Delete all empty inputs except for the last one
            workspace.examples = workspace.examples.filter((value, index) => {
                if (index === workspace.examples.length - 1) {
                    return true;
                }
                return value.text.length > 0;
            })
        },
        markExampleAsLoading: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.examples = workspace.examples.map(value => {
                if (value.id === action.payload) {
                    value.isLoading = true;
                }
                return value;
            });
        },
        markAllExamplesAsNotLoading: (state) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.examples = workspace.examples.map(value => {
                value.isLoading = false;
                return value;
            });
        },
        loadOutputForExample: (state, action: PayloadAction<LoadExampleOutputActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.examples = workspace.examples.map(value => {
                if (value.id === action.payload.id) {
                    value.previousOutput = value.output;
                    value.output = action.payload.output;
                    value.isLoading = false;
                }
                return value;
            });
        },
        deleteExample: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.examples = workspace.examples.filter(example => example.id !== action.payload);
        },
        updateExamplePreviousOutputsStatus: (state, action: PayloadAction<boolean>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.showExamplePreviousOutputs = action.payload;
        },

        updateVariationsLoadingStatus: (state, action: PayloadAction<boolean>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.loadingVariations = action.payload;
        },
        addVariation: (state, action: PayloadAction<AddVariationActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.variations.push({
                id: uniqid('variation_'),
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
        editMaxVariations: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.maxVariations = action.payload;
        },
        cleanVariations: (state) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.variations = [];
        },
        updateShowPromptForVariations: (state, action: PayloadAction<boolean>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.showPromptForVariations = action.payload;
        },

        normalizeConversations: (state) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            // Always add an empty conversation for user to start
            if (workspace.conversations.length < 1 || workspace.conversations[0].parts.length > 1) {
                const startSequence = "\nAI:";
                const restartSequence = "\nUser: ";
                workspace.conversations.unshift({
                    id: uniqid("conversation_"), parts: [
                        {text: convertConversationPartToText(
                            '', ConversationPartSource.user,
                                startSequence, restartSequence),
                            source: ConversationPartSource.user,
                            submitted: false}
                    ], completionParams: undefined, inputValue: '',
                    isLoading: false, initialPrompt: undefined, startSequence: startSequence, restartSequence: restartSequence
                });
            }
        },
        setConversationCompletionParams: (state,
                                          action: PayloadAction<SetConversationCompletionParametersActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.completionParams = action.payload.parameters;
                }
                return conversation;
            });
        },
        setConversationInitialPrompt: (state, action: PayloadAction<SetConversationInitialPromptActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.initialPrompt = action.payload.initialPrompt;
                }
                return conversation;
            });
        },
        updateConversationLoadingStatus: (state, action: PayloadAction<UpdateConversationLoadingStatusActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.isLoading = action.payload.status;
                }
                return conversation;
            });
        },
        updateConversationInputValue: (state, action: PayloadAction<UpdateConversationInputValueActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.inputValue = action.payload.inputValue;
                }
                return conversation;
            });
        },
        updateConversationStartSequence: (state, action: PayloadAction<UpdateConversationStartSequenceActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.startSequence = action.payload.startSequence;
                }
                return conversation;
            });
        },
        updateConversationRestartSequence: (state, action: PayloadAction<UpdateConversationRestartSequenceActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id === action.payload.conversationId) {
                    conversation.restartSequence = action.payload.restartSequence;
                }
                return conversation;
            });
        },
        addMessageInConversation: (state, action: PayloadAction<AddMessageToConversationFromUserActionPayload | AddMessageToConversationFromGptActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.map(conversation => {
                if (conversation.id !== action.payload.conversationId) {
                    return conversation;
                }

                let inputText: string;
                if (action.payload.source === ConversationPartSource.user) {
                    inputText = conversation.inputValue;
                    conversation.inputValue = '';
                } else {
                    inputText = action.payload.text;
                }

                const lastPartInd = conversation.parts.length - 1;
                const lastPart = conversation.parts[lastPartInd];

                // It shouldn't happen.
                if (lastPart.source !== action.payload.source) {
                    console.log('[lastPart.source !== action.payload.source]');
                    return conversation;
                }

                lastPart.text = convertConversationPartToText(
                    inputText, lastPart.source,
                    conversation.startSequence, conversation.restartSequence)
                lastPart.submitted = true;
                conversation.parts[lastPartInd] = lastPart;

                const nextSource = (
                    lastPart.source === ConversationPartSource.gpt
                        ? ConversationPartSource.user
                        : ConversationPartSource.gpt
                );
                conversation.parts.push({
                    source: nextSource,
                    text: convertConversationPartToText(
                        '', nextSource,
                        conversation.startSequence, conversation.restartSequence),
                    submitted: false
                });

                return conversation;
            });
        },
        deleteConversation: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.conversations = workspace.conversations.filter(c => c.id !== action.payload);
        },

        loadTemplate: (state, action: PayloadAction<LoadTemplateActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.prompt = action.payload.prompt;
            workspace.examples = action.payload.examples.map((example) => {
                return {id: uniqid('example_'), text: example.text, output: example.output, isLoading: false}
            });

            if (action.payload.stopSymbols !== undefined) {
                workspace.stopSymbols = action.payload.stopSymbols;
            }
            workspace.tabIndex = action.payload.tabIndex;
        },
        loadTemplateFromFileData: (state, action: PayloadAction<LoadTemplateFromFileDataActionPayload>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.prompt = action.payload.prompt;
            workspace.temperature = action.payload.temperature;
            workspace.topP = action.payload.topP;
            workspace.frequencyPenalty = action.payload.frequencyPenalty;
            workspace.presencePenalty = action.payload.presencePenalty;
            workspace.maxTokens = action.payload.maxTokens;
            workspace.stopSymbols = action.payload.stopSymbols;
            workspace.modelName = action.payload.modelName;
        },
        editPrompt: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.prompt = action.payload;
        },
        editApiKey: (state, action: PayloadAction<string>) => {
            state.apiKey = action.payload;
        },
        editModelName: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.modelName = action.payload;
        },
        editTemperature: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.temperature = action.payload;
        },
        editTopP: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.topP = action.payload;
        },
        editFrequencyPenalty: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.frequencyPenalty = action.payload;
        },
        editPresencePenalty: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.presencePenalty = action.payload;
        },
        addStopSymbol: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.stopSymbols.push(action.payload);
        },
        deleteStopSymbol: (state, action: PayloadAction<string>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.stopSymbols = workspace.stopSymbols.filter((symbol) => symbol !== action.payload);
        },
        editMaxTokens: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.maxTokens = action.payload;
        },
        updateTabIndex: (state, action: PayloadAction<number>) => {
            let workspace = state.workspaces.find(w => w.id === state.currentWorkspaceId)!
            workspace.tabIndex = action.payload;
        },

        updateWorkspaceId: (state, action: PayloadAction<string>) => {
          state.currentWorkspaceId = action.payload;
        },

        toggleApiKeyDialog: (state, action: PayloadAction<boolean>) => {
            state.showApiKeyDialog = action.payload;
        },
        toggleTemplateDialog: (state, action: PayloadAction<boolean>) => {
            state.showTemplateDialog = action.payload;
        },
    },
});

const fetchForCurrentTab = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    let workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!
    switch (workspace.tabIndex) {
        case TabIndex.multipleExamples: {
            dispatch(fetchExamplesOutputsAsync());
            break;
        }
        case TabIndex.variations: {
            dispatch(fetchVariationsAsync());
            break;
        }
    }
}

const fetchExamplesOutputsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    let workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!
    if (state.editor.present.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (workspace.prompt.length === 0) {
        alert("The prompt can't be empty");
        return;
    }
    if (workspace.prompt.indexOf('{example}') === -1) {
        alert('Use "{example"} in your prompt to use the Multiple Examples mode');
        return;
    }

    const examples = workspace.examples.filter(example => example.text.length > 0);
    if (examples.length === 0) {
        alert('Enter at least one example');
        return;
    }

    const completionParams = selectCompletionParameters(state);
    const examplePrompts = examples.map(example => completionParams.prompt.replace('{example}', example.text));
    const exampleIds = examples.map(example => example.id);
    exampleIds.map((exampleId) => dispatch(markExampleAsLoading(exampleId)));

    GptAPI.generateCompletions(examplePrompts, completionParams).then(response => {
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

const fetchVariationsAsync = (): AppThunk => (dispatch, getState) => {
    const state = getState();
    let workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
    if (state.editor.present.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    if (workspace.prompt.length === 0) {
        alert("The prompt can't be empty");
        return;
    }

    dispatch(updateVariationsLoadingStatus(true));

    const completionParams = selectCompletionParameters(state);

    GptAPI.generateCompletions(completionParams.prompt, completionParams, workspace.maxVariations).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        dispatch(updateVariationsLoadingStatus(false));
        response.choices.map((variationResult: ChoiceResult) => (
            dispatch(addVariation({
                output: variationResult.text,
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
        dispatch(updateVariationsLoadingStatus(false));
    });
}

const sendMessageInConversationAsync = (conversationId: string): AppThunk => (dispatch, getState) => {
    const state = getState();
    let workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
    if (state.editor.present.apiKey === undefined) {
        alert('Enter an API key before running requests.');
        return;
    }
    const conversation = workspace.conversations.find(conversation => conversation.id === conversationId);
    if (conversation === undefined) {
        return;
    }

    // If it is a first message in the conversation, lock current completion parameters and prompt for whole conversation
    if (conversation.parts.length === 1) {
        dispatch(setConversationInitialPrompt({
            conversationId: conversationId, initialPrompt: selectPrompt(state)
        }));
        dispatch(setConversationCompletionParams({
            conversationId: conversationId, parameters: selectCompletionParameters(state)
        }));
    }

    dispatch(addMessageInConversation({conversationId: conversationId, source: ConversationPartSource.user}))
    dispatch(updateConversationLoadingStatus({conversationId: conversationId, status: true}));

    const updatedState = getState();
    let updatedWorkspace = updatedState.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
    const updatedConversation = updatedWorkspace.conversations.find(conversation => conversation.id === conversationId);
    if (updatedConversation === undefined) {
        return;
    }
    const completionParams = {apiKey: state.editor.present.apiKey, ...updatedConversation.completionParams!};
    const prompt = updatedConversation.initialPrompt + updatedConversation.parts.map(p => p.text).join('');
    GptAPI.generateCompletions(prompt, completionParams).then(response => {
        console.log(response.data);
        return { ...response.data };
    }).then(response => {
        dispatch(updateConversationLoadingStatus({conversationId: conversationId, status: false}));
        dispatch(addMessageInConversation({conversationId: conversationId, source: ConversationPartSource.gpt,
            text: response['choices'][0]['text']}))
    });

}

const selectApiKey = (state: RootState) => state.editor.present.apiKey;
const selectApiKeyDialogVisible = (state: RootState) => state.editor.present.showApiKeyDialog;
const selectTemplateDialogVisible = (state: RootState) => state.editor.present.showTemplateDialog;

const selectTabIndex = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.tabIndex;
const selectPrompt = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.prompt;
const selectStopSymbols = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.stopSymbols;

const selectModelName = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.modelName;
const selectTemperature = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.temperature;
const selectTopP = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.topP;
const selectFrequencyPenalty = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.frequencyPenalty;
const selectPresencePenalty = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.presencePenalty;
const selectMaxTokens = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.maxTokens;
const selectCompletionParameters = (state: RootState) => {
    const workspace = state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!;
    return {
        apiKey: state.editor.present.apiKey === undefined ? '' : state.editor.present.apiKey,
        engine: workspace.modelName,
        maxTokens: workspace.maxTokens,
        stop: (() => {
            if (workspace.stopSymbols.length > 0) {
                return workspace.stopSymbols.map(symbol => {
                    return symbol.split('\\n').join('\n');
                });
            } else {
                return '';
            }
        })(),
        prompt: workspace.prompt,
        temperature: workspace.temperature,
        topP: workspace.topP,
        presencePenalty: workspace.presencePenalty,
        frequencyPenalty: workspace.frequencyPenalty,
    };
};

const selectExamples = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.examples;
const selectExamplePreviousOutputsStatus = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.showExamplePreviousOutputs;

const selectVariationsLoadingStatus = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.loadingVariations;
const selectVariations = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.variations;
const selectMaxVariations = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.maxVariations;
const selectShowPromptForVariations = (state: RootState) => state.editor.present.workspaces.find(w => w.id === state.editor.present.currentWorkspaceId)!.showPromptForVariations;

// Helpers

function convertConversationPartToText(text: string, source: ConversationPartSource,
                                       startSequence: string, restartSequence: string): string {
    if (source === ConversationPartSource.user) {
        return restartSequence + text;
    } else { // source === ConversationPartSource.gpt
        return startSequence + text;
    }
}

// Exports

export default editorSlice.reducer;
export {editorSlice};

// State Enums

export {TabIndex, ConversationPartSource};

// State Parts

export type {
    CompletionParameters, Example, // for code generator
    ConversationCompletionParameters, // for conversation's completion parameters props
};

// Action payloads

export type {
    LoadTemplateFromFileDataActionPayload, LoadTemplateActionPayload, // for templates library
};

// Selectors

export {
    // Common
    selectTabIndex, selectPrompt, selectStopSymbols, selectApiKey, selectModelName,
    selectTemperature, selectTopP, selectFrequencyPenalty, selectPresencePenalty,
    selectMaxTokens, selectApiKeyDialogVisible, selectTemplateDialogVisible,
    selectCompletionParameters,

    // Modes
    selectExamples, selectExamplePreviousOutputsStatus,
    selectVariationsLoadingStatus, selectVariations, selectMaxVariations,
    selectShowPromptForVariations,
};

// Async Actions

export {
    fetchForCurrentTab, fetchExamplesOutputsAsync,
    fetchVariationsAsync, sendMessageInConversationAsync
};

// Actions
export const { editExample, loadOutputForExample, deleteExample, cleanExampleList, markExampleAsLoading, updateExamplePreviousOutputsStatus,
    markAllExamplesAsNotLoading,
    addVariation, editMaxVariations, cleanVariations, updateShowPromptForVariations, updateVariationsLoadingStatus,
    setConversationCompletionParams, normalizeConversations, updateConversationLoadingStatus, updateConversationInputValue,
    updateConversationStartSequence, updateConversationRestartSequence, addMessageInConversation,
    setConversationInitialPrompt, deleteConversation,
    addStopSymbol, deleteStopSymbol,
    editTopP, editFrequencyPenalty, editPresencePenalty,
    loadTemplate, loadTemplateFromFileData,
    editPrompt, editApiKey, editModelName, editTemperature, editMaxTokens, updateTabIndex, toggleApiKeyDialog, toggleTemplateDialog } = editorSlice.actions;

// Action Payloads
