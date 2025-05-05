import { Context } from "probot";
import {LlmAgent} from "../../llm-agent.js";
import SummarizeIssueAgent from "../../common/summarize-issue.agent.js";
import logger from "../../../logger.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";


export class WebhookSummarizeIssueAgent extends LlmAgent<Context<"issues"> | Context<"issue_comment.created">, void> {
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
                .map((comment) => `Comment by ${comment.user.login}: ${comment.body}`)
                .join("\n");

            const context = `${issueTitle}\n${issueDescription}\n${commentsText}`;

            const summarizeIssueAgent = new SummarizeIssueAgent();
            const response = await summarizeIssueAgent.handleEvent(context);
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
        return "issue_summarize";
    }
}

export default WebhookSummarizeIssueAgent