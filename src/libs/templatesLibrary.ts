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
    {name: 'Multiple Examples', templates: [
            {id: uniqueId('template_'), name: 'Company Classification', actionPayload: {
                    prompt: 'The following is a list of companies and the categories they fall into\n' +
                        '\n' +
                        'Facebook: Social media, Technology\n' +
                        'Uber: Transportation, Technology, Marketplace\n' +
                        'Mcdonalds: Food, Fast Food, Logistics, Restaurants\n' +
                        '{example}:',
                    tabIndex: 0,
                    examples: [{text: 'Unilever', output: 'Consumer Goods, Food, Personal Care, Retail'}, {text: 'LinkedIn', output: 'Social Media, Technology, Business'}, {text: 'FedEx', output: 'Logistics, Transportation'}]
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
                examples: [{text: 'A person was running to the church.', output: ''},
                     {text: 'A person cooked a great meal.', output: ''}],
                tabIndex: 0
                }},
            {id: uniqueId('template_'), name: 'Song Generation', actionPayload: {
                    stopSymbols: ["\\n\\n"],
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
                            'in the dusk', output: ''},
                        {text: 'Country roads, take me home\n' +
                                'To the place I belong\n' +
                                'West Virginia, mountain mama\n' +
                                'Take me home, country roads',
                        output: ''}
                    ],
                    tabIndex: 0
                }},
            {id: uniqueId('template_'), name: 'Sentence => Email', actionPayload: {
                    prompt: '```\n' +
                        'Thank John for the book. \n' +
                        '\n' +
                        '````\n' +
                        '\n' +
                        'Dear John,\n' +
                        '\n' +
                        'Thank you so much for the book. I really appreciate it. \n' +
                        '\n' +
                        'I hope to hang out soon. \n' +
                        '\n' +
                        'Your friend, \n' +
                        '\n' +
                        'Sarah\n' +
                        '\n' +
                        '###\n' +
                        '\n' +
                        'Tell TechCorp I appreciate the great service.\n' +
                        '\n' +
                        '````\n' +
                        '\n' +
                        'To Whom it May Concern, \n' +
                        '\n' +
                        'I want you to know that I appreciate the great service at TechCorp.\n' +
                        '\n' +
                        'The staff is outstanding and I enjoy every visit. \n' +
                        '\n' +
                        'Sincerely, \n' +
                        '\n' +
                        'Bill Johnson\n' +
                        '\n' +
                        '###\n' +
                        '\n' +
                        'Invoice Kelly Watkins $500 for design consultation.\n' +
                        '\n' +
                        '````\n' +
                        '\n' +
                        'Dear Ms. Watkins, \n' +
                        '\n' +
                        'This is my invoice for $500 for design consultation. \n' +
                        '\n' +
                        'It was a pleasure to work with you. \n' +
                        '\n' +
                        'Sincerely, \n' +
                        '\n' +
                        'Emily Fields\n' +
                        '\n' +
                        '###\n' +
                        '\n' +
                        'Invite Amanda and Paul to the company event Friday night. \n' +
                        '\n' +
                        '```\n' +
                        'Dear Amanda and Paul,\n' +
                        '\n' +
                        'I hope this finds you doing well. \n' +
                        '\n' +
                        'I want to invite you to our company event on Friday night. \n' +
                        '\n' +
                        'It will be a great opportunity for networking and there will be food and drinks. \n' +
                        '\n' +
                        'Should be fun. \n' +
                        '\n' +
                        'Best, \n' +
                        '\n' +
                        'Ryan\n' +
                        '\n' +
                        '###\n' +
                        '\n' +
                        '{example}\n' +
                        '\n' +
                        '```\n',
                    stopSymbols: ['###'],
                    examples: [
                        {'text': 'Ask RAM Co. if they have new storage units in stock.', 'output': ''}
                    ],
                    tabIndex: 0
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
                    examples: [],
                    tabIndex: 0
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
                    examples: [],
                    tabIndex: 0
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
                    examples: [],
                    tabIndex: 0
                }},
            {id: uniqueId('template_'), name: 'Rhyming', actionPayload: {
                    prompt: '```\n' +
                        'A homophone is defined as a word that is pronounced the same as another word but \n' +
                        'differs in meaning.\n' +
                        '\n' +
                        'Here is a list of homophones:\n' +
                        '1. Accept/Except\n' +
                        '2. Affect/Effect\n' +
                        '3. Allude/Elude\n' +
                        '4. Alter/Altar\n' +
                        '5. A lot/Allot\n' +
                        '\n' +
                        'Here\'s a list of homophones starting with the letter "{example}":\n',
                    examples: [
                        {text: "b", output: ""}
                    ],
                    stopSymbols: [],
                    tabIndex: 0
                }}

        ]
    },
    {name: 'Creative', templates: [
            {id: uniqueId('template_'), name: 'React Components', actionPayload: {
                prompt: 'import React from \'react\';\n' +
                    '\n' +
                    'const ThreeButtonComponent=()=>(',
                examples: [], tabIndex: 1
                }},
            {id: uniqueId('template_'), name: 'Analogies Generator', actionPayload: {
                    prompt: 'Neural networks are like',
                    stopSymbols: ['.'],
                    examples: [], tabIndex: 1
                }},
            {id: uniqueId('template_'), name: 'Idea Generator', actionPayload: {
                    prompt: 'Here is a list of 100 interesting ideas for new movie plots. Each plot is \n' +
                        'described with a title and a summary paragraph:\n' +
                        '\n' +
                        '1. The Bird. \n' +
                        'A woman realizes that her pet bird is actually highly intelligent and able to communicate. The bird turns out to be a secret agent working for the CIA. The woman has to keep the bird\'s secret.\n' +
                        '\n' +
                        '2.',
                    stopSymbols: ['3'],
                    examples: [], tabIndex: 1
                }},
        ]}
];

export default function getTemplateGroups() : Array<TemplateGroup> {
    return templateGroups;
}

export function getFlattenedTemplates() {
    return ([] as Template[]).concat(...getTemplateGroups().map((templateGroup) => templateGroup.templates));
}
