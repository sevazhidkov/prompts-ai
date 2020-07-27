export function gptClient() {
    return 1;
}

export interface ChoiceResult {
    finish_reason: string;
    index: number;
    text: string;
}
