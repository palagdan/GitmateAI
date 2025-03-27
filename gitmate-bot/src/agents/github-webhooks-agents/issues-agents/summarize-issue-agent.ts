import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import OpenAI from "openai";
import {GitHubService} from "../../../services/github-service.js";
import llmClient from "../../../llm-client.js";
import logger from "../../../logger.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";

export class SummarizeIssueAgent extends LLMAgent<Context, void> {

    constructor(private gitHubService: GitHubService) {
        super();
    }

    async handleEvent(event: Context): Promise<void> {
        try {
            const issue = await this.gitHubService.getIssue(event);
            const comments = await this.gitHubService.listComments(event);

            const issueTitle = issue.data.title;
            const issueDescription = issue.data.body || "";
            const commentsText = comments
                .map((comment: any) => `Comment by ${comment.user.login}: ${comment.body}`)
                .join("\n");

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.SUMMARIZE_ISSUE,{
                title: issueTitle,
                description: issueDescription,
                comments: commentsText,
            })

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{role: "user", content: prompt}],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };

            const chatCompletion = await llmClient.chat.completions.create(params);
            const responseText: string = chatCompletion.choices[0]?.message?.content?.trim() || "No summary generated.";

            await this.gitHubService.createComment(event, responseText);
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
        }
    }
}