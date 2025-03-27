import {Context} from "probot";
import OpenAI from "openai";
import {LLMAgent} from "../../llm-agent.js";
import {GitHubService} from "../../../services/github-service.js";
import {formatMessage, getErrorMsg} from "../../../messages/messages.js";
import llmClient from "../../../llm-client.js";
import logger from "../../../logger.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";


export class IssueLabelAgent extends LLMAgent<Context, string> {

    constructor(private gitHubService: GitHubService) {
        super();
    }

    async handleEvent(event: Context): Promise<string> {
        try {
            const issue = await this.gitHubService.getIssue(event);
            const availableLabels = await this.gitHubService.listLabelsForRepo(event);

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.LABEL_ISSUE,{
                issueTitle: issue.data.title,
                issueBody: issue.data.body || "",
                availableLabels: availableLabels.data.map((label: any) => label.name).join(", "),
            });

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{role: "user", content: prompt}],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };

            const chatCompletion = await llmClient.chat.completions.create(params);
            const responseText: string = chatCompletion.choices[0]?.message?.content?.trim() || "";
            const parsedResponse = JSON.parse(responseText);
            const labels: string[] = parsedResponse.labels || [];

            if (labels.length > 0) {
                await this.gitHubService.addLabels(event, labels);
                logger.info(`Labels added: ${labels.join(", ")}`);
                return  formatMessage(`
                ### IssueLabelAgent Report🤖
                Following labels were added based on the provided information: ${labels.map(label => `**${label}**`).join(", ")}`
                );

            } else {
                logger.info("No labels suggested to add. A comment was added to the issue.");
                return  formatMessage(`
                ### IssueLabelAgent Report🤖

                No labels were added based on the provided information.
                `);

            }


        } catch (error) {
            logger.error(`Error occurred: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }


}
