import {LlmAgent} from "../../llm-agent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "../issues-agents/create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import SearchPRsAgent from "../../common/pull-requests-agents/search-prs.agent.js";

export class WebhookSearchPRsAgent extends LlmAgent<Context<"issues"> | Context<"issue_comment.created">, void> {

    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const searchPRsAgent = new SearchPRsAgent();

            const response = await searchPRsAgent.handleEvent({
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
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(this.constructor.name, error),
                pullRequest: false,
                agentId: this.constructor.name
            })
        }
    }


    getService(): string {
        return "issue-find-similar-pull-requests";
    }
}