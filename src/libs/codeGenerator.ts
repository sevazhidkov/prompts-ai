import {TabIndex, Example, CompletionParameters} from "../app/slices/editorSlice";

interface CodeExample {
    id: string;
    name: string;
    text: string;
    language: string;
}

enum PythonOutputType {
    plain,
    stream,
    toxicity
}

export default function generateCodeExamples(completionParameters: CompletionParameters, tabIndex: TabIndex,
                                             examples: Array<Example>): Array<CodeExample> {
    const exampleText = getFirstExampleOrPlaceholder(examples);
    return [
        {id: '1', name: "Python", language: "python", text: generatePythonExample(
                completionParameters, tabIndex, exampleText, PythonOutputType.plain
            )},
        {id: '2', name: "Python: Streaming", language: "python", text: generatePythonExample(
                completionParameters, tabIndex, exampleText, PythonOutputType.stream
            )},
        {id: '3', name: "Node.js: Axios", language: "javascript", text: generateNodeJsExample(
                completionParameters, tabIndex, exampleText
            )},
        {id: '4', name: "Typescript: Axios", language: "typescript", text: generateTypescriptExample(
                completionParameters, tabIndex, exampleText
            )},
        {id: '5', name: "Bash", language: "bash", text: generateShellExample(
                completionParameters, tabIndex, exampleText
            )},


        //{name: "Python: With Toxicity Check", text: generatePythonExample(
        //        completionParameters, tabIndex, exampleText, PythonOutputType.toxicity
        //    )},

        // {name: "Javascript", text: generatePythonExampleWithStream(completionParameters, tabIndex)},
        // {name: "Javascript: Client-side Streaming", text: generatePythonExampleWithStream(completionParameters, tabIndex)},

        // {name: "Javascript: With Toxicity Check", text: generatePythonExampleWithStream(completionParameters, tabIndex)},
    ];
}

function generateNodeJsExample(parameters: CompletionParameters, tabIndex: TabIndex, exampleText: string) {
    switch (tabIndex) {
        case TabIndex.multipleExamples: {
            return `var axios = require('axios');

var example = ${formatJavascriptString(exampleText)};
var config = {
  method: 'post',
  url: 'https://api.openai.com/v1/engines/${parameters.engine}/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ${parameters.apiKey}'
  },
  data: {
    'prompt': ${formatJavascriptString(parameters.prompt)}.replace('{example}', example),
    'max_tokens': ${parameters.maxTokens},
    'temperature': ${parameters.temperature},
    'top_p': ${parameters.topP},
    'n': 1,
    'stop': ${formatStopSymbolsJavascriptStringOrStringList(parameters.stop)},
    'presence_penalty': ${parameters.presencePenalty},
    'frequency_penalty': ${parameters.frequencyPenalty}}
};

axios(config)
.then(function (response) {
  console.log(response.data);
  console.log(response.data['choices'][0]['text']);
})
.catch(function (error) {
  console.log(error);
});
`;
        }
        case TabIndex.creativeGeneration: {
            return `var axios = require('axios');

var config = {
  method: 'post',
  url: 'https://api.openai.com/v1/engines/${parameters.engine}/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ${parameters.apiKey}'
  },
  data: {
    'prompt': ${formatJavascriptString(parameters.prompt)},
    'max_tokens': ${parameters.maxTokens},
    'temperature': ${parameters.temperature},
    'top_p': ${parameters.topP},
    'n': 1,
    'stop': ${formatStopSymbolsJavascriptStringOrStringList(parameters.stop)},
    'presence_penalty': ${parameters.presencePenalty},
    'frequency_penalty': ${parameters.frequencyPenalty}}
};

axios(config)
.then(function (response) {
  console.log(response.data);
  console.log(response.data['choices'][0]['text']);
})
.catch(function (error) {
  console.log(error);
});
`;
        }
        case TabIndex.chatBot: {
            return ``;
        }
    }
}

function generateTypescriptExample(parameters: CompletionParameters, tabIndex: TabIndex, exampleText: string) {
    switch (tabIndex) {
        case TabIndex.multipleExamples: {
            return `import axios from 'axios'

const example = ${formatJavascriptString(exampleText)}

axios({
  method: 'post',
  url: 'https://api.openai.com/v1/engines/${parameters.engine}/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ${parameters.apiKey}'
  },
  data: {
    'prompt': ${formatJavascriptString(parameters.prompt)}.replace('{example}', example),
    'max_tokens': ${parameters.maxTokens},
    'temperature': ${parameters.temperature},
    'top_p': ${parameters.topP},
    'n': 1,
    'stop': ${formatStopSymbolsJavascriptStringOrStringList(parameters.stop)},
    'presence_penalty': ${parameters.presencePenalty},
    'frequency_penalty': ${parameters.frequencyPenalty}}
})
.then(response => {
  console.log(response.data)
  console.log(response.data['choices'][0]['text'])
})
.catch(error => {
  console.log(error)
});
`;
        }
        case TabIndex.creativeGeneration: {
            return `import axios from 'axios' 

axios({
  method: 'post',
  url: 'https://api.openai.com/v1/engines/${parameters.engine}/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ${parameters.apiKey}'
  },
  data: {
    'prompt': ${formatJavascriptString(parameters.prompt)},
    'max_tokens': ${parameters.maxTokens},
    'temperature': ${parameters.temperature},
    'top_p': ${parameters.topP},
    'n': 1,
    'stop': ${formatStopSymbolsJavascriptStringOrStringList(parameters.stop)},
    'presence_penalty': ${parameters.presencePenalty},
    'frequency_penalty': ${parameters.frequencyPenalty}}
})
.then(function (response) {
  console.log(response.data)
  console.log(response.data['choices'][0]['text'])
})
.catch(function (error) {
  console.log(error)
});
`;
        }
        case TabIndex.chatBot: {
            return ``;
        }
    }
}

function generateShellExample(parameters: CompletionParameters, tabIndex: TabIndex, exampleText: string) {
    switch (tabIndex) {
        case TabIndex.multipleExamples: {
            return `curl --location --request POST 'https://api.openai.com/v1/engines/davinci/completions' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer ${parameters.apiKey}' \\
--data-raw '${replaceAllOccurrences(JSON.stringify({
                'prompt': parameters.prompt.replace('{example}', exampleText),
                'max_tokens': parameters.maxTokens,
                'temperature': parameters.temperature,
                'top_p': parameters.topP,
                'n': 1,
                'stop': formatStopSymbolsForShell(parameters.stop),
                'presence_penalty': parameters.presencePenalty,
                'frequency_penalty': parameters.frequencyPenalty
            }, null, 1), "'", "\'")}'`;
        }
        case TabIndex.creativeGeneration: {
            return `import axios from 'axios' 

axios({
  method: 'post',
  url: 'https://api.openai.com/v1/engines/${parameters.engine}/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ${parameters.apiKey}'
  },
  data: {
    'prompt': ${formatJavascriptString(parameters.prompt)},
    'max_tokens': ${parameters.maxTokens},
    'temperature': ${parameters.temperature},
    'top_p': ${parameters.topP},
    'n': 1,
    'stop': ${formatStopSymbolsJavascriptStringOrStringList(parameters.stop)},
    'presence_penalty': ${parameters.presencePenalty},
    'frequency_penalty': ${parameters.frequencyPenalty}}
})
.then(function (response) {
  console.log(response.data)
  console.log(response.data['choices'][0]['text'])
})
.catch(function (error) {
  console.log(error)
});
`;
        }
        case TabIndex.chatBot: {
            return ``;
        }
    }
}

function generatePythonExample(parameters: CompletionParameters, tabIndex: TabIndex, exampleText: string,
                               outputType: PythonOutputType) {
    let completionVariableName, additionalArguments, outputCode;
    switch (outputType) {
        case PythonOutputType.plain: {
            completionVariableName = 'completion';
            additionalArguments = '';
            outputCode = `choice = completion["choices"][0]
print("[choice object]", choice)
print("[choice text]", choice["text"])`;
            break;
        }
        case PythonOutputType.stream: {
            completionVariableName = 'parts';
            additionalArguments = `
  stream=True`;
            outputCode = `for completion in parts:
  choice = completion["choices"][0]
  print("[choice object]", choice)
  print("[choice text]", choice["text"])`;
            break;
        }
        case PythonOutputType.toxicity: {
            completionVariableName = 'completion';
            additionalArguments = '';
            outputCode = `choice = completion["choices"][0]
print("[choice object]", choice)
print("[choice text]", choice["text"])

filter_completion = openai.Completion.create(
  engine="davinci",
  max_tokens=1,
  prompt=f"<|endoftext|>{choice['text']}\\n--\\nLabel: ",
  temperature=0.0,
  top_p=0,
)
filter_result = completion["choices"][0]["text"]
if filter_result == "0":
    print("[content status] safe")
if filter_result == "1":
    print("[content status] non-toxic warning")
if filter_result == "2":
    print("[content status] toxic")`;
            break;
        }

    }
    switch (tabIndex) {
        case TabIndex.multipleExamples: {
            return `import openai
openai.api_key = "${parameters.apiKey}"
prompt = ${formatPythonString(parameters.prompt)}
example = ${formatPythonString(exampleText)}
${completionVariableName} = openai.Completion.create(
  engine="${parameters.engine}",
  n=1,
  max_tokens=${parameters.maxTokens},
  stop=${formatStopSymbolsPythonStringOrStringList(parameters.stop)},
  prompt=prompt.replace("{example}", example),
  temperature=${parameters.temperature},
  top_p=${parameters.topP},
  presence_penalty=${parameters.presencePenalty},
  frequency_penalty=${parameters.frequencyPenalty},${additionalArguments}
)
${outputCode}
`;
        }
        case TabIndex.creativeGeneration: {
            return `import openai
openai.api_key = "${parameters.apiKey}"
${completionVariableName} = openai.Completion.create(
  engine="${parameters.engine}",
  n=1,
  max_tokens=${parameters.maxTokens},
  stop=${formatStopSymbolsPythonStringOrStringList(parameters.stop)},
  prompt=${formatPythonString(parameters.prompt)},
  temperature=${parameters.temperature},
  top_p=${parameters.topP},
  presence_penalty=${parameters.presencePenalty},
  frequency_penalty=${parameters.frequencyPenalty},
  echo=True,${additionalArguments}
)
${outputCode}
`;
        }
        case TabIndex.chatBot: {
            return ``;
        }
    }
}

// Shell helpers

function formatStopSymbolsForShell(value: Array<string> | string) {
    if (value instanceof Array) {
        return value.map(formatStopSymbolStringForCode);
    } else {
        return formatStopSymbolStringForCode(value);
    }
}

// Javascript helpers

function formatJavascriptString(value: string) {
    if (value.includes("\n")) {
        const formattedString = replaceAllOccurrences(value,'`', '\\`');
        return `\`${formattedString}\``;
    } else {
        const formattedString = replaceAllOccurrences(value, "'", "\\'");
        return `'${formattedString}'`;
    }
}

function formatStopSymbolsJavascriptStringOrStringList(value: Array<string> | string) {
    if (value instanceof Array) {
        return formatJavascriptStringList(value.map(formatStopSymbolStringForCode));
    } else {
        return formatJavascriptString(formatStopSymbolStringForCode(value));
    }
}

function formatJavascriptStringList(value: Array<string>) {
    return `[${value.map(value => `'${replaceAllOccurrences(value, "'", "\'")}'`).join(', ')}]`;
}

// Python helpers

function formatStopSymbolsPythonStringOrStringList(value: Array<string> | string) {
    if (value instanceof Array) {
        return formatPythonStringList(value.map(formatStopSymbolStringForCode));
    } else {
        return formatPythonString(formatStopSymbolStringForCode(value));
    }
}

function formatPythonStringList(value: Array<string>) {
    return `[${value.map(value => `"${value}"`).join(', ')}]`;
}

function formatPythonString(value: string) {
    if (value.includes("\n")) {
        const formattedString = replaceAllOccurrences(value, '"""', '\"\"\"');
        return `"""${formattedString}"""`;
    } else {
        const formattedString = replaceAllOccurrences(value, '"', '\\"');
        return `"${formattedString}"`;
    }
}

// Common helpers

function getFirstExampleOrPlaceholder(examples: Array<Example>): string {
    if (examples.length > 0 && examples[0].text.length > 0) {
        return examples[0].text;
    }
    return 'example';
}

function formatStopSymbolStringForCode(value: string) {
    return `${replaceAllOccurrences(value, '\n', '\\n')}`;
}

function replaceAllOccurrences(value: string, replace_from: string, replace_to: string) {
    return value.split(replace_from).join(replace_to);
}


