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
    },
    {name: 'Multiple Examples', templates: [
            {id: uniqueId('template_'), name: 'Alliteration Generator', actionPayload: {
                prompt: 'Find synonyms for words that can create alliterations.\n' +
                    '\n' +
                    'Sentence: The dog went to the store.\n' +
                    'Alliteration: The dog drove to the department.\n' +
                    '\n' +
                    'Sentence: David wears a hat everyday.\n' +
                    'Alliteration: David dons a derby daily.\n' +
                    '\n' +
                    'Sentence: The soap dries over night.\n' +
                    'Alliteration: The soap shrivels succeeding sunset.\n' +
                    '\n' +
                    'Sentence: {example}\n' +
                    'Alliteration:',
                 examples: [{text: 'A person was running to the church.', output: 'A priest pranced to the chapel.'},
                     {text: 'A person cooked a great meal.', output: ' A cook concocted an incredible cafe.'}]
                }},
            {id: uniqueId('template_'), name: 'Song Generation', stopSymbols: ["\\n\\n"], actionPayload: {
                    prompt: 'VERSE:\n' +
                        'Alas my love,\n' +
                        'You do me wrong,\n' +
                        'To cast me off discourteously,\n' +
                        'for i have loved you so long,\n' +
                        'delighting in your company.\n' +
                        '\n' +
                        'CHORDS:\n' +
                        'Alas[Am] my[C] love,\n' +
                        'you [G]do [Em]me wrong,\n' +
                        'to [Am]cast me off dis[E]courteously,\n' +
                        'for [Am]i have[C] loved[G] you [Em]so long,\n' +
                        'de[Am]lighting in[E7] your [Am]company.\n' +
                        '\n' +
                        'VERSE:\n' +
                        '{example}\n' +
                        '\n' +
                        'CHORDS:',
                    examples: [
                        {text: 'My pangolin heart\n' +
                            'has scales of bone\n' +
                            'black and streaked with red\n' +
                            'hidden like a forgotten gem\n' +
                            'in the dusk', output: '\n' +
                                'My [G5]pangolin [C7]heart\n' +
                                'has scales of [C]bone\n' +
                                'black and [E7b9]streaked with [E]red\n' +
                                'hidden like a [Am]forgotten gem\n' +
                                'in the [C7]dusk.'},
                        {text: 'Country roads, take me home\n' +
                                'To the place I belong\n' +
                                'West Virginia, mountain mama\n' +
                                'Take me home, country roads',
                        output: '\n' +
                            'Country [G]roads, take [Am]me home\n' +
                            'To the [C]place [G]I be[Em]long\n' +
                            'West Virginia, [Am]mountain mama\n' +
                            '[A7]Take me home, [E7]country [Am]roads\n' +
                            '(instrumental)'}
                    ]
                }},
            {id: uniqueId('template_'), name: 'Alliteration Generator', actionPayload: {
                    prompt: 'Find synonyms for words that can create alliterations.\n' +
                        '\n' +
                        'Sentence: The dog went to the store.\n' +
                        'Alliteration: The dog drove to the department.\n' +
                        '\n' +
                        'Sentence: David wears a hat everyday.\n' +
                        'Alliteration: David dons a derby daily.\n' +
                        '\n' +
                        'Sentence: The soap dries over night.\n' +
                        'Alliteration: The soap shrivels succeeding sunset.\n' +
                        '\n' +
                        'Sentence: {example}\n' +
                        'Alliteration:',
                    examples: []
                }},
            {id: uniqueId('template_'), name: 'Alliteration Generator', actionPayload: {
                    prompt: 'Find synonyms for words that can create alliterations.\n' +
                        '\n' +
                        'Sentence: The dog went to the store.\n' +
                        'Alliteration: The dog drove to the department.\n' +
                        '\n' +
                        'Sentence: David wears a hat everyday.\n' +
                        'Alliteration: David dons a derby daily.\n' +
                        '\n' +
                        'Sentence: The soap dries over night.\n' +
                        'Alliteration: The soap shrivels succeeding sunset.\n' +
                        '\n' +
                        'Sentence: {example}\n' +
                        'Alliteration:',
                    examples: []
                }},
            {id: uniqueId('template_'), name: 'Alliteration Generator', actionPayload: {
                    prompt: 'Find synonyms for words that can create alliterations.\n' +
                        '\n' +
                        'Sentence: The dog went to the store.\n' +
                        'Alliteration: The dog drove to the department.\n' +
                        '\n' +
                        'Sentence: David wears a hat everyday.\n' +
                        'Alliteration: David dons a derby daily.\n' +
                        '\n' +
                        'Sentence: The soap dries over night.\n' +
                        'Alliteration: The soap shrivels succeeding sunset.\n' +
                        '\n' +
                        'Sentence: {example}\n' +
                        'Alliteration:',
                    examples: []
                }},
            {id: uniqueId('template_'), name: 'Alliteration Generator', actionPayload: {
                    prompt: 'Find synonyms for words that can create alliterations.\n' +
                        '\n' +
                        'Sentence: The dog went to the store.\n' +
                        'Alliteration: The dog drove to the department.\n' +
                        '\n' +
                        'Sentence: David wears a hat everyday.\n' +
                        'Alliteration: David dons a derby daily.\n' +
                        '\n' +
                        'Sentence: The soap dries over night.\n' +
                        'Alliteration: The soap shrivels succeeding sunset.\n' +
                        '\n' +
                        'Sentence: {example}\n' +
                        'Alliteration:',
                    examples: []
                }}

        ]
    },
    {name: 'Creative', templates: [
            {id: uniqueId('template_'), name: 'React Components', actionPayload: {
                prompt: 'import React from \'react\';\n' +
                    '\n' +
                    'const ThreeButtonComponent=()=>(',
                examples: []
                }}
        ]}
];

export default function getTemplateGroups() : Array<TemplateGroup> {
    return templateGroups;
}

export function getFlattenedTemplates() {
    return ([] as Template[]).concat(...getTemplateGroups().map((templateGroup) => templateGroup.templates));
}
