import {LLMAgent} from "../../LLMAgent.js";
import {Context} from "probot";
import {GitHubService} from "../../../services/github-service.js";
import logger from "../../../logger.js";
import SummarizeIssueAgent from "../../common/summarize-issue.agent.js";

export class WebhookSummarizeIssueAgent extends LLMAgent<Context, void> {

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

            const context = `${issueTitle}\n${issueDescription}\n${commentsText}`;


            const summarizeIssueAgent = new SummarizeIssueAgent();
            await summarizeIssueAgent.handleEvent(context);
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
        }
    }
}

export default WebhookSummarizeIssueAgent;