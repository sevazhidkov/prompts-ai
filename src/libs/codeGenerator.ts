import { TabIndex, Example } from "../app/slices/editorSlice";

interface CodeExample {
    id: string;
    name: string;
    text: string;
}

export interface CompletionParameters {
    apiKey: string;
    engine: string;
    maxTokens: number;
    stop: string | Array<string>;
    prompt: string;
    temperature: number;
    topP: number;
    presencePenalty: number;
    frequencyPenalty: number;
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
        {id: '1', name: "Python", text: generatePythonExample(
                completionParameters, tabIndex, exampleText, PythonOutputType.plain
            )},
        {id: '2', name: "Python: Streaming", text: generatePythonExample(
                completionParameters, tabIndex, exampleText, PythonOutputType.stream
            )},
        //{name: "Python: With Toxicity Check", text: generatePythonExample(
        //        completionParameters, tabIndex, exampleText, PythonOutputType.toxicity
        //    )},

        // {name: "Javascript", text: generatePythonExampleWithStream(completionParameters, tabIndex)},
        // {name: "Javascript: Client-side Streaming", text: generatePythonExampleWithStream(completionParameters, tabIndex)},
        // {name: "Javascript: With Toxicity Check", text: generatePythonExampleWithStream(completionParameters, tabIndex)},
    ];
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
    }
}

function formatStopSymbolsPythonStringOrStringList(value: Array<string> | string) {
    if (value instanceof Array) {
        return formatPythonStringList(value.map(formatStopSymbolPythonString));
    } else {
        return formatPythonString(formatStopSymbolPythonString(value));
    }
}

function formatStopSymbolPythonString(value: string) {
    return `${value.replace('\n', '\\n')}`;
}

function formatPythonStringList(value: Array<string>) {
    return `[${value.map(value => `"${value}"`).join(', ')}]`;
}

function formatPythonString(value: string) {
    const formattedString = value.replace('"', '\\"');
        if (formattedString.includes("\n")) {
        return `"""${formattedString}"""`;
    } else {
        return `"${formattedString}"`;
    }
}

function getFirstExampleOrPlaceholder(examples: Array<Example>): string {
    if (examples.length > 0 && examples[0].text.length > 0) {
        return examples[0].text;
    }
    return 'example';
}

