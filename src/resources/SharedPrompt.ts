const admin = require('firebase-admin');
const db = admin.firestore();
const mydoc = db.collection("SharedPrompt").documentData;

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
    static create (properties: SharedPromptWriteProperties): Promise<typeof mydoc> {
        const mydb = db.collection('SharedPrompts');
        return db.collection('SharedPrompts').add(properties);
    }
}