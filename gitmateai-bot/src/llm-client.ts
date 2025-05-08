import OpenAI from "openai";

interface LLMClient {
    generateCompletion(prompt: string): Promise<string>
}

class OpenAIClient implements LLMClient {

    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.LLM_API_KEY });
    }

    async generateCompletion(prompt: string): Promise<string> {
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: "user", content: prompt }],
            model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
        };

        const chatCompletion = await this.client.chat.completions.create(params);
        return chatCompletion.choices[0]?.message?.content?.trim() || "{}";
    }
}


export function getLLMClient(provider = 'openai') {
    switch(provider) {
        case 'openai':
            return new OpenAIClient();
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

export const llmClient = getLLMClient(process.env.LLM_PROVIDER);


