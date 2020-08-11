import React from 'react';
// @ts-ignore
import Files from "react-files";
import {Button} from "@material-ui/core";
import {useDispatch} from "react-redux";
import {loadTemplateFromFileData, LoadTemplateFromFileDataActionPayload} from "../../slices/editorSlice";

export default function UploadButton() {
    const dispatch = useDispatch();

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
        if (event.target === undefined) {
            return;
        }
        if (event.target!.result === undefined) {
            return;
        }
        const template: LoadTemplateFromFileDataActionPayload = JSON.parse(event.target!.result as string);

        template.stopSymbols = template.stopSymbols.map(symbol => {
            return symbol.split('\n').join('\\n');
        });
        dispatch(loadTemplateFromFileData(template));
    };

    return <Files
        className="files-dropzone"
        onChange={(file: any) => {
            fileReader.readAsText(file[0]);
        }}
        onError={(err: any) => console.log(err)}
        accepts={['.json']}
        maxFileSize={10000000}
        minFileSize={0}
        clickable
    >
        <Button>From file</Button>
    </Files>;
}