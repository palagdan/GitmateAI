import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import CreateIssueCommentAgent from "../issues-agents/create-issue-comment.agent.js";
import {summarizeDiff} from "./utils.js";
import {PR_AGENT_PROMPTS} from "../../../prompts.js";
import {getErrorMsg} from "../../../messages/messages.js";
import {Agent} from "../../../agent.decorator.js";
import parse from "parse-diff";
import {llmClient} from "../../../llm-client.js";

@Agent()
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

            const { data: comments } = await event.octokit.issues.listComments({
                owner,
                repo,
                issue_number: pr.number,
            });

            const files = await event.octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: pr.number
            });

            const context = `
PR Title: ${pr.title}
PR Description: ${pr.body || ""}
                
Files Changed:
${files.data.map(file => summarizeFileByHunks(file)).join("\n")}
`;

            const prTitle = pr.title;
            const prDescription = pr.body || "";

            const prompt = this.createPrompt(PR_AGENT_PROMPTS.SUMMARIZE_PR, {
                title: prTitle,
                description: prDescription,
                comments: comments
                    .map((comment) => `Comment by ${comment.user.login}:\n${comment.body}`)
                    .join("\n\n"),
                diff: context
            });

            const result = await llmClient.generateCompletion(prompt);

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


export function summarizeFileByHunks(file: { filename: string, patch?: string, changes?: number }): string {
    if (!file.patch) {
        return `- ${file.filename} (no patch)`;
    }

    const parsedFiles = parse(file.patch);
    const hunkSummaries = parsedFiles.flatMap(parsedFile =>
        parsedFile.chunks.map(hunk => {
           return hunk.content + '\n' + hunk.changes.map(change => change.content).join('\n');
        })
    );

    return `- ${file.filename} (${file.changes} changes)\n${hunkSummaries.join('\n')}`;
}


export default WebhookSummarizePRAgent;