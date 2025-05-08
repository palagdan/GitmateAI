import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {getErrorMsg} from "../../../messages/messages.js";
import SearchCodeAgent from "../../common/code-agents/search-code.agent.js";
import {Agent} from "../../../agent.decorator.js";
import {Inject} from "typedi";

@Agent()
export class WebhookSearchCodeAgent extends LLMAgent<Context<"pull_request"> | Context<"issue_comment.created">, void> {

    @Inject()
    private searchCodeAgent: SearchCodeAgent;

    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {

            const issue = event.payload.issue;

            const issueText = `${issue.title}\n\n${issue.body || ""}`;

            const response = await this.searchCodeAgent.handleEvent({
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
        return "issue-code-search";
    }
}

export default WebhookSearchCodeAgent;