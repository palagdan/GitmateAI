import {Context} from "probot";
import {LLMAgent} from "../../llm-agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import SearchIssuesAgent from "../../common/issues-agents/search-issues.agent.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";

export class WebhookSearchIssuesAgent extends LLMAgent<Context<"issues"> | Context<"issue_comment.created">, void> {

    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const searchIssuesAgent = new SearchIssuesAgent();

            const response = await searchIssuesAgent.handleEvent({
                content: issueText,
                limit: 20,
                exclude: {
                    owner: event.payload.repository.owner.login,
                    repo: event.payload.repository.name,
                    issueNumber: issue.number
                }
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
        return "issue-issues-search";
    }
}