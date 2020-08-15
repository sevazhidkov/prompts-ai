import firebase from '../services/firebase';

interface SharedPromptWriteProperties {
    engine: string;
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
    examples?: Array<SharedPromptExample>;
}

interface SharedPromptExample {
    text: string;
}

export default class SharedPrompt {
    static create (properties: SharedPromptWriteProperties): Promise<firebase.firestore.DocumentData> {
        const db = firebase.firestore();
        return db.collection('SharedPrompts').add(properties);
    }
}