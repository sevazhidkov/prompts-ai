import uniqid from "uniqid";

export const migrations = {
    0: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                maxCreativeCompletions: 10,
                creativeCompletions: []
            }
        };
    },
    1: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                showPromptForCreativeCompletions: true,
            }
        };
    },
    2: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                tabIndex: 0
            }
        };
    },
    3: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                stopSymbols: []
            }
        };
    },
    4: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                topP: 1,
                frequencyPenalty: 0,
                presencePenalty: 0,
            }
        };
    },
    5: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                creativeCompletions: state.creativeCompletions.map((completion: any) => ({
                    ...completion,
                    topP: 1,
                    frequencyPenalty: 0,
                    presencePenalty: 0,
                }))
            }
        };
    },
    6: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                showExamplePreviousOutputs: false
            }
        };
    },
    7: (state: any) => {
        return {
            ...state,
            editor: {
                past: [],
                future: [],
                present: {...state.editor}
            }
        };
    },
    8: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                present: {
                    ...state.editor.present,
                    modelName: 'davinci'
                }
            }
        }
    },
    9: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                present: {
                    ...state.editor.present,
                    conversations: []
                }
            }
        }
    },

    10: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                present: {
                    ...state.editor.present,
                    loadingVariations: state.editor.present.loadingCreativeCompletions,
                    variations: state.editor.present.creativeCompletions,
                    maxVariations: state.editor.present.maxCreativeCompletions,
                    showPromptForVariations: state.editor.present.showPromptForCreativeCompletions
                }
            }
        }
    },

    12: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                present: {
                    ...state.editor.present,
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
                }
            }
        }
    },

    13: (state: any) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                present: {
                    ...state.editor.present,
                    workspaces: state.editor.present.workspaces.map((workspace: any) => ({
                        ...workspace,
                        name: 'Draft #1'
                    })),
                }
            }
        }
    }
};

export const currentVersion = 13;
