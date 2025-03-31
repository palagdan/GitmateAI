import {LlmAgent} from "../llm.agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../prompts.js";
import OpenAI from "openai";
import llmClient from "../../llm-client.js";
import logger from "../../logger.js";


interface LabelContext{
    issueInformation: string,
    availableLabels: string[],
}


export class IssueLabelAgent extends LlmAgent<LabelContext, string[]> {


    async handleEvent(context: LabelContext): Promise<string[]> {
        try {
            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.LABEL_ISSUE,{
                context: context.issueInformation,
                availableLabels: context.availableLabels.map((label: any) => label.name).join(", ")
            });

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{role: "user", content: prompt}],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };

            const chatCompletion = await llmClient.chat.completions.create(params);
            const responseText: string = chatCompletion.choices[0]?.message?.content?.trim() || "";
            const parsedResponse = JSON.parse(responseText);
            return parsedResponse.labels || [];
        } catch (error) {
            logger.error(`Error occurred: ${(error as Error).message}`);
            return [];
        }
    }

}

export default IssueLabelAgent;
