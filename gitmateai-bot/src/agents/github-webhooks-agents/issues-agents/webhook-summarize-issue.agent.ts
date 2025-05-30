import { Context } from "probot";
import {LLMAgent} from "../../llm-agent.js";

import logger from "../../../logger.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import {Agent} from "../../../agent.decorator.js";
import {llmClient} from "../../../llm-client.js";

@Agent()
export class WebhookSummarizeIssueAgent extends LLMAgent<Context<"issues"> | Context<"issue_comment.created">, void> {
    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;
            const issue_number = issue.number;

            const { data: comments } = await event.octokit.issues.listComments({
                owner,
                repo,
                issue_number,
            });

            const issueTitle = issue.title;
            const issueDescription = issue.body || "";
            const commentsText = comments
                .map((comment) => `Comment by ${comment.user.login}:\n${comment.body}`)
                .join("\n\n");

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.SUMMARIZE_ISSUE, {
                title: issueTitle,
                description: issueDescription,
                comments: commentsText,
            });

            const response = await llmClient.generateCompletion(prompt);

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: response,
                pullRequest: false,
                agentId: this.constructor.name
            });
        } catch (error) {
            logger.error(`Error in WebhookSummarizeIssueAgent: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(this.constructor.name, error),
                pullRequest: false,
                agentId: this.constructor.name
            });
        }
    }

    getService(): string {
        return "issue-summarize";
    }
}

export default WebhookSummarizeIssueAgent