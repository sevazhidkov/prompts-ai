import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from "lodash";
import { RootState } from '../store';
import {TestInput} from "../../components/testInput/TestInput";

interface TestInput {
    id: string;
    text: string;
    output?: string;
}

interface TestInputEditActionPayload {
    id: string;
    text: string;
}

interface TestInputLoadOutputActionPayload {
    id: string;
    output: string;
}

interface EditorState {
    prompt: string;
    testInputs: Array<TestInput>;
}

const initialState: EditorState = {
    prompt: "Test {input}",
    testInputs: [{id: uniqueId("input_"), text: "Input 1", output: "Lol"}]
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        editInput: (state, action: PayloadAction<TestInputEditActionPayload>) => {
            state.testInputs = state.testInputs.map(value => {
                if (value.id == action.payload.id) {
                    value.text = action.payload.text;
                }
                return value;
            });
        },
        loadOutput: (state, action: PayloadAction<TestInputLoadOutputActionPayload>) => {
            state.testInputs = state.testInputs.map(value => {
                if (value.id == action.payload.id) {
                    value.output = action.payload.output;
                }
                return value;
            });
        },
    },
});

export const { editInput, loadOutput } = editorSlice.actions;

export default editorSlice.reducer;
