import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import SearchCommitsAgent from "../../common/commits-agents/search-commits-agent.js";
import {Agent} from "../../../agent.decorator.js";
import {Inject} from "typedi";


@Agent()
export class WebhookSearchCommitsAgent extends LLMAgent<Context<"issues"> | Context<"issue_comment.created">, void> {

    @Inject()
    private searchCommitsAgent: SearchCommitsAgent;

    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {

            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const response = await this.searchCommitsAgent.handleEvent({
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
        return "issue-commit-search";
    }
}

export default WebhookSearchCommitsAgent;