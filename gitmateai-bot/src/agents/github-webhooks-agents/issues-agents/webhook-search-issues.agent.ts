import {Context} from "probot";
import {LLMAgent} from "../../LLMAgent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import logger from "../../../logger.js";
import SearchIssuesAgent from "../../common/issues-agents/search-issues.agent.js";

export class WebhookSearchIssuesAgent extends LLMAgent<Context, string> {

    constructor() {
        super();
    }

    async handleEvent(context: Context): Promise<string> {
        try {
            const { owner, repo, issue_number } = context.issue();
            const issue = await context.octokit.issues.get({ owner, repo, issue_number });

            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const searchIssuesAgent = new SearchIssuesAgent();
            return await searchIssuesAgent.handleEvent({
                content: issueText,
                limit: 20
            });
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}