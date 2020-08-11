import React from "react";
import {useSelector} from "react-redux";
import {IconButton} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import {
    selectFrequencyPenalty, selectMaxTokens, selectModelName,
    selectPresencePenalty,
    selectPrompt, selectStopSymbols,
    selectTemperature,
    selectTopP
} from "../../slices/editorSlice";

export default function DownloadButton() {
    const prompt = useSelector(selectPrompt);
    const temperature = useSelector(selectTemperature);
    const topP = useSelector(selectTopP);
    const frequencyPenalty = useSelector(selectFrequencyPenalty);
    const presencePenalty = useSelector(selectPresencePenalty);
    const maxTokens = useSelector(selectMaxTokens);
    const stopSymbols = useSelector(selectStopSymbols);
    const modelName = useSelector(selectModelName);

    const handleSaveAndDownload = () => {
        const element = document.createElement("a");
        const savedStopSymbols = stopSymbols.map(symbol => {
            return symbol.split('\\n').join('\n');
        });
        const file = new Blob([
            JSON.stringify({prompt, temperature, topP,
                frequencyPenalty, presencePenalty,
                maxTokens, stopSymbols: savedStopSymbols, modelName,
            })
        ], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `prompt_${Math.trunc(Date.now() / 1000)}.json`;
        document.body.appendChild(element);
        element.click();
    }

    return <IconButton onClick={handleSaveAndDownload}><SaveIcon/></IconButton>;
}
