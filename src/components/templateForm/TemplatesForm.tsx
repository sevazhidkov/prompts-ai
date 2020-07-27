import React from "react";
import {useDispatch} from "react-redux";
import getTemplateGroups, {getFlattenedTemplates} from "../../libs/templatesLibrary";
import { loadTemplate, cleanExampleList } from "../../app/slices/editorSlice";
import {Button, FormControl, InputLabel, Select, Box} from "@material-ui/core";

interface FormElements extends HTMLCollection {
    templateId: HTMLSelectElement;
}

export default function TemplatesForm() {
    const templateGroups = getTemplateGroups();
    const flattenedTemplates = getFlattenedTemplates();

    const dispatch = useDispatch();

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
            <FormControl>
                <InputLabel htmlFor="template-select">Templates</InputLabel>
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
                <Button type="submit" variant="contained" color="primary">Load</Button>
            </Box>
        </form>
    </Box>;
}