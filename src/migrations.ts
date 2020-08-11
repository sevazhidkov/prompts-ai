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
    }
};

export const currentVersion = 10;
