import {Context} from "probot";
import {LlmAgent} from "../../llm.agent.js";

import {getErrorMsg} from "../../../messages/messages.js";
import logger from "../../../logger.js";
import SimilarIssuesDetectorAgent from "../../common/similar-issue-detector.agent.js";


export class SimilarIssuesDetectorWebhookAgent extends LlmAgent<Context, string> {

    constructor() {
        super();
    }

    async handleEvent(context: Context): Promise<string> {
        try {
            const { owner, repo, issue_number } = context.issue();
            const issue = await context.octokit.issues.get({ owner, repo, issue_number });

            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const similarIssueDetectorAgent = new SimilarIssuesDetectorAgent();

            return await similarIssueDetectorAgent.handleEvent(issueText);
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}