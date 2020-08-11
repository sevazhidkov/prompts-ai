import React from "react";
import {useDispatch} from "react-redux";
import {Button, FormControl, Select, Box, Grid} from "@material-ui/core";
// @ts-ignore
import Files from "react-files";
import getTemplateGroups, {getFlattenedTemplates} from "../libs/templatesLibrary";
import {loadTemplate, cleanExampleList, LoadTemplateFromFileDataActionPayload, loadTemplateFromFileData} from "../slices/editorSlice";

interface FormElements extends HTMLCollection {
    templateId: HTMLSelectElement;
}

export default function TemplatesForm() {
    const templateGroups = getTemplateGroups();
    const flattenedTemplates = getFlattenedTemplates();

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

    return <Box>
        <form onSubmit={(event) => {
            event.preventDefault();
            const elements: FormElements = event.currentTarget.elements as FormElements;
            const template = flattenedTemplates.find((template) => template.id === elements.templateId.value);
            if (template === undefined) {
                return;
            }
            dispatch(loadTemplate(template.actionPayload))
            dispatch(cleanExampleList());
        }}>
            <FormControl style={{minWidth: '100%'}}>
                <Select native defaultValue="" id="template-select" name="templateId">
                    {templateGroups.map((templateGroup, ind) => (
                        <optgroup key={ind} label={templateGroup.name}>
                            {templateGroup.templates.map(template => (
                                <option key={template.id} value={template.id}>{template.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </Select>
            </FormControl>
            <Box mt={1}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">Load</Button>
                    </Grid>
                    <Grid>
                        <Files
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
                        </Files>
                    </Grid>
                </Grid>

            </Box>
        </form>
    </Box>;
}