import {Context} from "probot";
import {LLMAgent} from "../../LLMAgent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import logger from "../../../logger.js";
import SearchIssuesAgent from "../../common/issues-agents/search-issues.agent.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";

export class WebhookSearchIssuesAgent extends LLMAgent<Context<"issues">, void> {

    async handleEvent(event: Context<"issues">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const searchIssuesAgent = new SearchIssuesAgent();

            const response = await searchIssuesAgent.handleEvent({
                content: issueText,
                limit: 20
            });

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: response,
                pullRequest: false,
                agentId: this.constructor.name
            })
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(this.constructor.name, error),
                pullRequest: false,
                agentId: this.constructor.name
            })
        }
    }
}