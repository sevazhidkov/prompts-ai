import {uniqueId} from "lodash";
import {LoadTemplateActionPayload, TabIndex} from '../slices/editorSlice';

export interface Template {
    id: string;
    name: string;
    actionPayload: LoadTemplateActionPayload;
}

interface TemplateGroup {
    name: string;
    templates: Array<Template>;
}

const templateGroups = [
    {name: 'Simple', templates: [
            {
                id: uniqueId('template_'),
                name: 'Top 10 Women',
                actionPayload: {
                    prompt: 'Top 10 most important women in human history, and their greatest achievements:\n' +
                        '\n' +
                        '1.',
                    stopSymbols: ['11.'],
                    tabIndex: TabIndex.basic,
                    examples: []
                }
            },
            {
                id: uniqueId('template_'),
                name: 'Email Generation',
                actionPayload: {
                    prompt: 'The following email explains two things:\n' +
                        '1) The writer, Andy, is going to miss work.\n' +
                        '2) The receiver, Betty, is Andy\'s boss and can email if anything needs to be done.\n' +
                        '\n' +
                        'From: ',
                    stopSymbols: [],
                    tabIndex: TabIndex.basic,
                    examples: []
                },
            },
            {
                id: uniqueId('template_'),
                name: 'Federalist Paper (Memory)',
                actionPayload: {
                    prompt: 'FEDERALIST No. 79. The Judiciary Continued\n' +
                        '\n' +
                        'HAMILTON\n' +
                        '\n' +
                        'To the People of the State of New York.\n' +
                        '\n' +
                        'IN THE course of the preceding papers,',
                    stopSymbols: [],
                    tabIndex: TabIndex.basic,
                    examples: []
                },
            },
            {
                id: uniqueId('template_'),
                name: 'Simple Math',
                actionPayload: {
                    prompt: '2 * 4 =',
                    stopSymbols: ['\\n'],
                    tabIndex: TabIndex.basic,
                    examples: []
                },
            }
        ]},
    {name: 'Examples', templates: [
            {id: uniqueId('template_'), name: 'Company Classification', actionPayload: {
                    prompt: 'The following is a list of companies and the categories they fall into\n' +
                        '\n' +
                        'Facebook: Social media, Technology\n' +
                        'Uber: Transportation, Technology, Marketplace\n' +
                        'Mcdonalds: Food, Fast Food, Logistics, Restaurants\n' +
                        '{example}:',
                    tabIndex: TabIndex.multipleExamples,
                    stopSymbols: ['\\n'],
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
                tabIndex: 0,
                stopSymbols: ['\\n'],
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
                    tabIndex: TabIndex.multipleExamples,
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
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Book Review', actionPayload: {
                    prompt: 'Title: Lovely War\n' +
                        'Rating: 3/5\n' +
                        'Quotes:\n' +
                        '- "It was time for James and Hazel to get properly acquainted. Time to see if the magic of music and moonlight and graceful movement were all that they had shared, or if a grimy gray London dawn and a cheap cup of coffee could make them feel the same way."\n' +
                        '- "Annihilation has its own je ne sais quoi. We’re all guilty of it. So spare me the sermons."\n' +
                        '- "His mother’s letters are full of urgent warning. She grew up in Mississippi. \n' +
                        'She knows about lynching. Aubrey wonders if he’ll die in his country before he \n' +
                        'ever gets the chance to die for his country. Either way, he’d rather not."\n' +
                        '- "Whatever boost sixty captured miles might have brought to German morale was \n' +
                        'erased by the chocolate in the BEF’s packs. War is morale. War is supply. War is \n' +
                        'chocolate."\n' +
                        'Thoughts:\n' +
                        '- Pacing felt awkward\n' +
                        '- WW1 history felt accurate\n' +
                        '- Didn\'t care too much for the story of the Gods\n' +
                        'Review: A good book with well rounded characters, but the pacing felt super \n' +
                        'awkward. The titles of the chapters showed which Greek God was speaking, but I was more interested in the WW1 tales than their relationships.\n' +
                        '\n' +
                        '\'\'\'\n' +
                        '{example}\n' +
                        'Review:',
                    examples: [
                        {text: 'Title: Goodbye, Things\n' +
                                'Rating: 4/5\n' +
                                'Thoughts:\n' +
                                '- very cleanly written\n' +
                                '- read easily\n' +
                                '- author did good research', output: ''},
                        {text: 'Title: Deep Work: Rules for Focused Success in a Distracted World\n' +
                                'Rating: 5/5\n' +
                                'Thoughts:\n' +
                                '- Great read, got me to refocus my goals around my schedule.\n' +
                                '- Got me to delete a social media I used too much\n' +
                                '- I like that Cal Newport is a computer scientist as well', output: ''}
                    ],
                    tabIndex: TabIndex.multipleExamples,
                    stopSymbols: ['\\n\\n']
                }},
            {id: uniqueId('template_'), name: 'Headline Generation', actionPayload: {
                    prompt: 'Topic: Britain, coronavirus, beaches\n' +
                        'Headline: Videos show crowded beaches in Britain\n' +
                        '\n' +
                        'Topic: Apple, Big Sur, software\n' +
                        'Headline: Apple promises faster software update installation with macOS Big Sur\n' +
                        '\n' +
                        'Topic: Artic, climate change, satellite\n' +
                        'Headline: A Satellite Lets Scientists See Antarctica’s Melting Like Never Before\n' +
                        '\n' +
                        'Topic: {example}\n' +
                        'Headline:',
                    examples: [
                        {text: 'Chicago, restaurants, summer', output: ''}
                    ],
                    tabIndex: TabIndex.multipleExamples,
                    stopSymbols: ['\\n']
                }},
            {id: uniqueId('template_'), name: 'Product Name Generator', actionPayload: {
                    prompt: 'This is a product name generator. It takes a product\'s description and seed words, then outputs a list of potential product names.\n' +
                        '\n' +
                        'Product description: A complete home gym that can fit in any apartment.\n' +
                        'Seed words: intelligent, aspirational, luxury, futuristic\n' +
                        'Product names: InfinityHome, Quantum, FlexFit, Flight, FutureFit\n' +
                        '\n' +
                        'Product description: An affordable electric bike.\n' +
                        'Seed words: Easy, eco-friendly, practical, dependable\n' +
                        'Product names: Pegasus, Swifty, SunRunner, Wave, Amp\n' +
                        '\n' +
                        '{example}\n' +
                        'Product names:',
                    examples: [
                        {text: 'Product description: A zero carbohydrate cereal that tastes great.\n' +
                                'Seed words: fitness, healthy, keto, clean, tasty', output: ''}
                    ],
                    tabIndex: TabIndex.multipleExamples,
                    stopSymbols: ['\\n']
                }},
            {id: uniqueId('template_'), name: 'Rhyming', actionPayload: {
                    prompt: 'A homophone is defined as a word that is pronounced the same as another word but \n' +
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
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Q&A', actionPayload: {
                    prompt: "Q: What is the definition of a linearly independent list?\n" +
                        "A: A linearly independent list is a list of vectors that cannot be\n" +
                        " expressed as a linear combination of other vectors in the list.\n" +
                        " \n" +
                        "Q: What is a basis of a vector space?\n" +
                        "A: A basis of a vector space is a linearly independent list of vectors\n" +
                        " that spans the vector space.\n" +
                        "\n" +
                        "Q: What is a spanning list of vectors in a vector space?\n" +
                        "A: A spanning list of vectors in a vector space is list of vectors in\n" +
                        " the vector space such that every vector in the vector space can be\n" +
                        " written as a linear combination of the vectors in the spanning list.\n" +
                        " \n" +
                        "Q: {example}\n" +
                        "A:",
                    examples: [
                        {text: "What is an eigenvector of a linear transformation f?", output: ""},
                        {text: "What is the definition of a linear transformation?", output: ""},
                        {text: "Is the vector space of univariate polynomials over a finite field a finite-dimensional vector space?",
                            output: ""},
                        {text: "What is the maximum number of eigenvalues of an operator on a 5-dimensional vector space?", output: ""},
                        {text: "Can the length of a spanning list for a vector space be longer than any linearly independent list of vectors in that space?",
                            output: ""},

                    ],
                    stopSymbols: ["\\n"],
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Summarization', actionPayload: {
                    prompt: '```\n' +
                        'My second grader asked me what this passage means:\n' +
                        '\n' +
                        '"""\n' +
                        '\n' +
                        '{example}\n' +
                        '\n' +
                        '"""\n' +
                        '\n' +
                        'I rephrased it for him, in plain language a second grader can understand:\n' +
                        '\n' +
                        '"""\n',
                    examples: [
                        {text: "Overnight trading for the NYSE Index futures was a bit volatile, " +
                                "dropping by about 3% to the downside before moving sharply back to the upside. " +
                                "Gold futures were unchanged and the E-mini NASDAQ 100 futures remained near " +
                                "unchanged. The yield on the 10-year Treasury bond finished unchanged from its " +
                                "close of 2.45% earlier today.",
                            output: ""},
                        {text: "This Nondisclosure Agreement (the \"Agreement\") is entered into by and between _______________ with its principal offices at _______________, (\"Disclosing Party\") and _______________, located at _______________ (\"Receiving Party\") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below. The parties agree to enter into a confidential relationship concerning the disclosure of certain proprietary and confidential information (\"Confidential Information\"). 1. Definition of Confidential Information. For purposes of this Agreement, \"Confidential Information\" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. If Confidential Information is in written form, the Disclosing Party shall label or stamp the materials with the word \"Confidential\" or some similar warning. If Confidential Information is transmitted orally, the Disclosing Party shall promptly provide writing indicating that such oral communication constituted Confidential Information. 2. Exclusions from Confidential Information. Receiving Party's obligations under this Agreement do not extend to information that is: (a) publicly known at the time of disclosure or subsequently becomes publicly known through no fault of the Receiving Party; (b) discovered or created by the Receiving Party before disclosure by Disclosing Party; (c) learned by the Receiving Party through legitimate means other than from the Disclosing Party or Disclosing Party's representatives; or (d) is disclosed by Receiving Party with Disclosing Party's prior written approval.",
                            output: ""},
                    ],
                    stopSymbols: ['"""'],
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Code Translation', actionPayload: {
                    prompt: 'Python:\n' +
                        'list[::-1]\n' +
                        'Ruby:\n' +
                        'list.reverse\n' +
                        '\n' +
                        'Python:\n' +
                        'list[1:4]\n' +
                        'Ruby:\n' +
                        'list[1..4]\n' +
                        '\n' +
                        'Python:\n' +
                        'print("Hello World")\n' +
                        'Ruby:\n' +
                        'puts "Hello World"\n' +
                        '\n' +
                        'Python:\n' +
                        'fruits = ["apple","banana","cherry"]\n' +
                        'for x in fruits:\n' +
                        'print(x)\n' +
                        'Ruby:\n' +
                        'fruit = ["apple", "banana", "cherry"]\n' +
                        'each {|x| print x } \n' +
                        '\n' +
                        'Python:\n' +
                        '{example}\n' +
                        'Ruby:\n',
                    examples: [
                        {text: 'fruits = ["apple","banana","cherry"]\n' +
                                'a = list(fruits)\n' +
                                'print(a)\n' +
                                'a.reverse()\n' +
                                'print(a)', output: ""}
                    ],
                    stopSymbols: ["Python:"],
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Translation', actionPayload: {
                    prompt: 'English: I do not speak French.\n' +
                        'French: Je ne parle pas français.\n' +
                        '\n' +
                        'English: See you later!\n' +
                        'French: À tout à l\'heure!\n' +
                        '\n' +
                        'English: Where is a good restaurant?\n' +
                        'French: Où est un bon restaurant?\n' +
                        '\n' +
                        'English: {example}\n' +
                        'French:',
                    examples: [
                        {text: "What rooms do you have available?", output: ""}
                    ],
                    stopSymbols: ['\\n'],
                    tabIndex: TabIndex.multipleExamples
                }},
            {id: uniqueId('template_'), name: 'Estimation', actionPayload: {
                    prompt: 'Lower and upper bound for each quantity:\n' +
                        '\tNumber of cars in New York: 1500000 to 2500000\n' +
                        '\tNumber of cars in San Francicso: 300000 to 600000\n' +
                        '\tHeight of Empire State building: 1400 to 1500 feet\n' +
                        '\tLength of average car: 4 to 4.5 meters\n' +
                        '\tPopulation of Germany: 80 to 85 million\n' +
                        '\t{example}:',
                    examples: [
                        {text: "How much does the iPhone XI cost?", output: ""}
                    ],
                    stopSymbols: ['\\n'],
                    tabIndex: TabIndex.multipleExamples
                }},
        ]
    },
    {name: 'Variations', templates: [
            {id: uniqueId('template_'), name: 'React Components', actionPayload: {
                prompt: 'import React from \'react\';\n' +
                    '\n' +
                    'const ThreeButtonComponent=()=>(',
                examples: [], tabIndex: TabIndex.variations
                }},
            {id: uniqueId('template_'), name: 'Analogies Generator', actionPayload: {
                    prompt: 'Neural networks are like',
                    stopSymbols: ['.'],
                    examples: [], tabIndex: TabIndex.variations
                }},
            {id: uniqueId('template_'), name: 'Idea Generator', actionPayload: {
                    prompt: 'Here is a list of 100 interesting ideas for new movie plots. Each plot is ' +
                        'described with a title and a summary paragraph:\n' +
                        '\n' +
                        '1. The Bird. \n' +
                        'A woman realizes that her pet bird is actually highly intelligent and able to communicate. The bird turns out to be a secret agent working for the CIA. The woman has to keep the bird\'s secret.\n' +
                        '\n' +
                        '2.',
                    stopSymbols: ['3'],
                    examples: [], tabIndex: TabIndex.variations
                }},
            {id: uniqueId('template_'), name: 'Tweet Generation', actionPayload: {
                prompt: 'My favorite programming tweets:\n' +
                    '-------\n' +
                    'I asked @ilyasut how to set neural network init. He accidentally replied with a poem:\n' +
                    'You want to be on the edge of chaos\n' +
                    'Too small, and the init will be too stable, with vanishing gradients\n' +
                    'Too large, and you\'ll be unstable, due to exploding gradients\n' +
                    'You want to be on the edge\n' +
                    '-------\n' +
                    'I\'ve been programming for 10 years now. Still feels like magic out of a fantasy: say the words exactly right, and watch your intent get carried out; say the words slightly wrong, and things go haywire. Feeling of wonder and joy hasn\'t faded one bit.\n' +
                    '-------\n' +
                    'Web programming is the science of coming up with increasingly complicated ways of concatenating strings.\n' +
                    '-------\n' +
                    'If you ever feel alone in this world, read your firewall logs. Problem solved :)\n' +
                    '-------\n' +
                    'Always wanted to travel back in time to try fighting a younger version of yourself? Software development is the career for you!\n' +
                    '-------\n' +
                    'After 17 years as a professional developer, it seems that the answer to every programming question is "it depends"\n' +
                    '-------\n',
                    stopSymbols: ['\\n-'], examples: [], tabIndex: TabIndex.variations
                }},
            {id: uniqueId('template_'), name: 'Poem Generator', actionPayload: {
                    prompt: 'Who trusted God was love indeed\n' +
                        'And love Creation’s final law\n' +
                        'Tho’ Nature, red in tooth and claw\n' +
                        'With ravine, shriek’d against his creed.\n' +
                        'The hills are shadows, and they flow\n' +
                        'From form to form, and nothing stands;T\n' +
                        'hey melt like mist, the solid lands,\n' +
                        'Like clouds they shape themselves and go.\n' +
                        '----\n',
                    stopSymbols: ['--'], examples: [], tabIndex: TabIndex.variations
                }},
        ]},
    {
        name: 'Conversations',
        templates: [
            {id: uniqueId('template_'), name: 'Mark Zuckerberg', actionPayload: {
                    prompt: 'The following is a transcript of a conversation between Steve, a computer science student, ' +
                    'and Mark Zuckerberg. Mark Zuckerberg is an American media magnate, internet entrepreneur, and philanthropist. ' +
                    'He is known for co-founding Facebook, Inc. and serves as its chairman, chief executive officer,' +
                    ' and controlling shareholder.\n',
                    stopSymbols: ['\\n'],
                    examples: [],
                    tabIndex: TabIndex.conversations,
                    startSequence: '\nMark:',
                    restartSequence: '\nSteve: ',
                }},
            {id: uniqueId('template_'), name: 'AI Assistant', actionPayload: {
                    prompt: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n',
                    stopSymbols: ['\\n'],
                    examples: [],
                    tabIndex: TabIndex.conversations,
                    startSequence: '\nAI:',
                    restartSequence: '\nHuman: ',
                }}
        ]
    }
];

export default function getTemplateGroups() : Array<TemplateGroup> {
    return templateGroups;
}

export function getFlattenedTemplates() {
    return ([] as Template[]).concat(...getTemplateGroups().map((templateGroup) => templateGroup.templates));
}
