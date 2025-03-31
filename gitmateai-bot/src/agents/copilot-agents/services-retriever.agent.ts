import {LlmAgent} from "../llm.agent.js";
import OpenAI from "openai";
import llmClient from "../../llm-client.js";
import logger from "../../logger.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";
import {availableCopilotServicesToString} from "./available-copilot-services.js";
import {CopilotAgentInput} from "./types.js";


class ServicesRetrieverAgent extends LlmAgent<CopilotAgentInput, string[]> {


    constructor() {
        super()
    }

    async handleEvent(input: CopilotAgentInput): Promise<string[]> {
        const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.RETRIEVE_SERVICES,{
            availableServices: availableCopilotServicesToString(),
            userInput: input.content
        });

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{ role: "user", content: prompt }],
            model: process.env.LLM_MODEL_NAME || "gpt-4",
            response_format: { type: "json_object" }
        };

        try {
            const chatCompletion = await llmClient.chat.completions.create(params);
            const response = chatCompletion.choices[0]?.message?.content?.trim() || "[]";
            const result = JSON.parse(response);
            logger.info(`[ContextRetrieverAgent] Success. Matched ${result.services.length} service(s)`);
            return result.services;
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return [];
        }
    }
}

export default ServicesRetrieverAgent;