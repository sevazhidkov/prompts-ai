import { uniqueId } from "lodash";
import {LoadTemplateActionPayload} from '../app/slices/editorSlice';

interface Template {
    id: string;
    name: string;
    actionPayload: LoadTemplateActionPayload;
}

interface TemplateGroup {
    name: string;
    templates: Array<Template>;
}

export default function getTemplateGroups() : Array<TemplateGroup> {
    return [
        {name: 'Common', templates: [
                {id: uniqueId('template_'), name: 'Text to Command', actionPayload: {
                        prompt: 'Q: Ask Constance if we need some bread\n' +
                            'A: send-msg `find constance` Do we need some bread?\n' +
                            'Q: Send a message to Greg to figure out if things are ready for Wednesday.\n' +
                            'A: send-msg `find greg` Is everything ready for Wednesday?\n' +
                            'Q: Ask Ilya if we\'re still having our meeting this evening\n' +
                            'A: send-msg `find ilya` Are we still having a meeting this evening?\n' +
                            'Q: Contact the ski store and figure out if I can get my skis fixed before I leave on Thursday\n' +
                            'A: send-msg `find ski store` Would it be possible to get my skis fixed before I leave on Thursday?\n' +
                            'Q: {example}\n' +
                            'A:',
                        exampleTexts: [
                            "Q: Thank Nicolas for lunch\n",
                            "Q: Tell Constance that I won't be home before 19:30 tonight — unmovable meeting.\n"
                        ]}
                },
                {id: uniqueId('template_'), name: 'Company Classification', actionPayload: {
                        prompt: 'The following is a list of companies and the categories they fall into\n' +
                            '\n' +
                            'Facebook: Social media, Technology\n' +
                            'Uber: Transportation, Technology, Marketplace\n' +
                            'Mcdonalds: Food, Fast Food, Logistics, Restaurants\n' +
                            '{example}:',
                        exampleTexts: ['Unilever:', 'LinkedIn:', 'FedEx:']
                    }},
            ]
        }
    ];
}

export function getFlattenedTemplates() {
    return ([] as Template[]).concat(...getTemplateGroups().map((templateGroup) => templateGroup.templates));
}
