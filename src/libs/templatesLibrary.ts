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

const templateGroups = [
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
                    examples: [
                        {text: 'Thank Nicolas for lunch', output: 'send-msg `find nicolas` Thank you for lunch.'},
                        {text: 'Tell Constance that I won\'t be home before 19:30 tonight — unmovable meeting.', output: 'send-msg `find constance` I won\'t be home before 19:30 tonight — unmovable meeting.'}
                        ]
            }},
            {id: uniqueId('template_'), name: 'Company Classification', actionPayload: {
                    prompt: 'The following is a list of companies and the categories they fall into\n' +
                        '\n' +
                        'Facebook: Social media, Technology\n' +
                        'Uber: Transportation, Technology, Marketplace\n' +
                        'Mcdonalds: Food, Fast Food, Logistics, Restaurants\n' +
                        '{example}:',
                    examples: [{text: 'Unilever', output: 'Consumer Goods, Food, Personal Care, Retail'}, {text: 'LinkedIn', output: 'Social Media, Technology, Business'}, {text: 'FedEx', output: 'Logistics, Transportation'}]
                }},
        ]
    }
];

export default function getTemplateGroups() : Array<TemplateGroup> {
    return templateGroups;
}

export function getFlattenedTemplates() {
    return ([] as Template[]).concat(...getTemplateGroups().map((templateGroup) => templateGroup.templates));
}
