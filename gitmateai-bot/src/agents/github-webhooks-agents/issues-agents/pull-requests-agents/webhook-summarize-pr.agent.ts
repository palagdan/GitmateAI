import {LLMAgent} from "../../../LLMAgent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "../create-issue-comment.agent.js";

export class WebhookSummarizePRAgent extends LLMAgent<Context<"issues">, void> {

    async handleEvent(event: Context<"pull_request">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const pr = event.payload.pull_request;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;

            const files = await event.octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: pr.number
            });

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
            });
        } catch (error) {
            logger.error(`Error in WebhookSummarizeIssueAgent: ${(error as Error).message}`);
        }
    }
}