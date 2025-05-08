import {BaseAgent} from "./base.agent.js";
import logger from "../logger.js";
import OpenAI from "openai";
import llmClient from "../llm-client.js";

export abstract class LLMAgent<I, O> implements BaseAgent<I, O> {

    protected agentLogger = logger.child({ agent: this.constructor.name });

    abstract handleEvent(event: I): Promise<O>;

    protected createPrompt(promptTemplate: string, values: Record<string, string>): string {
        let prompt = promptTemplate;
        const unmatchedKeys = new Set(Object.keys(values));

        for (const [key, value] of Object.entries(values)) {
            const placeholder = `{{${key}}}`;
            if (prompt.includes(placeholder)) {
                prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
                unmatchedKeys.delete(key);
            }
        }

        if (unmatchedKeys.size > 0) {
            throw new Error(`The following keys were not found in the prompt template: ${Array.from(unmatchedKeys).join(', ')}`);
        }

        return prompt;
    }

    protected async generateCompletion(prompt: string): Promise<string> {
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: "user", content: prompt }],
            model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
        };

        const chatCompletion = await llmClient.chat.completions.create(params);
        return chatCompletion.choices[0]?.message?.content?.trim() || "{}";
    }
}