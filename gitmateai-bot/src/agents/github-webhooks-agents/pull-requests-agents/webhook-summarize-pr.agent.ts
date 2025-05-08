import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "../issues-agents/create-issue-comment.agent.js";
import {summarizeDiff} from "./utils.js";
import {PR_AGENT_PROMPTS} from "../../../prompts.js";
import {getErrorMsg} from "../../../messages/messages.js";

export class WebhookSummarizePRAgent extends LLMAgent<Context<"pull_request"> | Context<"issue_comment.created">, void> {

    async handleEvent(event:  Context<"pull_request"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {

            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;

            let pr: any;

            if ("pull_request" in event.payload) {
                pr = event.payload.pull_request
            } else {
                pr = event.payload.issue;
            }

            const files = await event.octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: pr.number
            });

            const context = `
PR Title: ${pr.title}
PR Description: ${pr.body || ""}
                
Files Changed:
${files.data.map(file => `- ${file.filename} (${file.changes} changes)\nDiff summary: ${summarizeDiff(file.patch)}`).join('\n')}
`;

            const prTitle = pr.title;
            const prDescription = pr.body || "";

            const prompt = this.createPrompt(PR_AGENT_PROMPTS.SUMMARIZE_PR, {
                title: prTitle,
                description: prDescription,
                diff: context
            });

            const result = await this.generateCompletion(prompt);

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: result,
                pullRequest: true,
                agentId: this.constructor.name
            });
        } catch (error) {
            this.agentLogger.error(`Error in WebhookSummarizeIssueAgent: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(error, this.constructor.name),
                pullRequest: true,
                agentId: this.constructor.name
            });
        }
    }

    getService(): string {
        return "pr-summarize";
    }
}

export default WebhookSummarizePRAgent;