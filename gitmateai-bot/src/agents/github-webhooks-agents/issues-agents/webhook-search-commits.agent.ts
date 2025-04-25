import {LLMAgent} from "../../LLMAgent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import SearchCommitsAgent from "../../common/commits-agents/search-commits-agent.js";

export class WebhookSearchCommitsAgent extends LLMAgent<Context<"issue_comment.created">, void> {

    async handleEvent(event: Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const searchCommitsAgent = new SearchCommitsAgent();

            const response = await searchCommitsAgent.handleEvent({
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
}

export default WebhookSearchCommitsAgent;