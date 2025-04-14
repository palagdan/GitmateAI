import { Context } from "probot";
import {LLMAgent} from "../../LLMAgent.js";
import SummarizeIssueAgent from "../../common/summarize-issue.agent.js";
import logger from "../../../logger.js";


export class WebhookSummarizeIssueAgent extends LLMAgent<Context<"issues">, void> {
    async handleEvent(event: Context<"issues">): Promise<void> {
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
            await summarizeIssueAgent.handleEvent(context);

        } catch (error) {
            logger.error(`Error in WebhookSummarizeIssueAgent: ${(error as Error).message}`);
        }
    }
}