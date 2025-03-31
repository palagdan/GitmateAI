import {LlmAgent} from "../llm.agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../prompts.js";
import OpenAI from "openai";
import llmClient from "../../llm-client.js";
import logger from "../../logger.js";
import {getErrorMsg} from "../../messages/messages.js";


export class SummarizeIssueAgent extends LlmAgent<string, string> {

    async handleEvent(context: string): Promise<string> {
        try {

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.SUMMARIZE_ISSUE,{
                context: context
            });

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{role: "user", content: prompt}],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };
            const chatCompletion = await llmClient.chat.completions.create(params);
            return chatCompletion.choices[0]?.message?.content?.trim() || "No summary generated.";
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default SummarizeIssueAgent;