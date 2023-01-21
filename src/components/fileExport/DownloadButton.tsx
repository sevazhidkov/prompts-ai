import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import {
  selectFrequencyPenalty,
  selectMaxTokens,
  selectModelName,
  selectPresencePenalty,
  selectPrompt,
  selectStopSymbols,
  selectTemperature,
  selectTopP,
} from "../../slices/editorSlice";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  className: string;
}

export default function DownloadButton(props: Props) {
  const prompt = useSelector(selectPrompt);
  const temperature = useSelector(selectTemperature);
  const topP = useSelector(selectTopP);
  const frequencyPenalty = useSelector(selectFrequencyPenalty);
  const presencePenalty = useSelector(selectPresencePenalty);
  const maxTokens = useSelector(selectMaxTokens);
  const stopSymbols = useSelector(selectStopSymbols);
  const modelName = useSelector(selectModelName);

  useHotkeys("ctrl+s,cmd+s", (event) => {
    event.preventDefault();
    handleSaveAndDownload();
  });

  const handleSaveAndDownload = () => {
    const element = document.createElement("a");
    const savedStopSymbols = stopSymbols.map((symbol) => {
      return symbol.split("\\n").join("\n");
    });
    const file = new Blob(
      [
        JSON.stringify({
          prompt,
          temperature,
          topP,
          frequencyPenalty,
          presencePenalty,
          maxTokens,
          stopSymbols: savedStopSymbols,
          modelName,
        }),
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `gpt3_workspace_${Math.trunc(Date.now() / 1000)}.json`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Button
      variant="outlined"
      color="default"
      className={props.className}
      size={"small"}
      startIcon={<SaveIcon />}
      onClick={handleSaveAndDownload}
    >
      Download
    </Button>
  );
}
