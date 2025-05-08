
import OpenAI from "openai";
import llmClient from "../../llm-client.js";
import {LLMAgent} from "../llm-agent.js";


class LLMQueryAgent extends LLMAgent<string, string> {

    async handleEvent(prompt: string): Promise<string> {

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: "user", content: prompt }],
            model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
        };

        const chatCompletion = await llmClient.chat.completions.create(params);
        return chatCompletion.choices[0]?.message?.content?.trim() || "{}";
    }

}

export default LLMQueryAgent;