import {Context} from "probot";

import {summarizeDiff} from "./utils.js";
import {LLMAgent} from "../../../LLMAgent.js";
import {PR_AGENT_PROMPTS} from "../../../../prompts.js";
import LLMQueryAgent from "../../../common/llm-query.agent.js";
import {formatMessage, getErrorMsg} from "../../../../messages/messages.js";
import CreateIssueCommentAgent from "../create-issue-comment.agent.js";

export class WebhookPRLabelAgent extends LLMAgent<Context<"pull_request">, void> {

    async handleEvent(event: Context<"pull_request">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const pr = event.payload.pull_request;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;

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

            const availableLabels = await event.octokit.issues.listLabelsForRepo({
                owner,
                repo,
            });

            let message: string;

            const prompt = this.createPrompt(PR_AGENT_PROMPTS.LABEL_PR, {
                context: context,
                availableLabels: availableLabels.data.map((label) => label.name).join(", ")
            });

            console.log(prompt)
            const llmQueryAgent = new LLMQueryAgent();
            const labels = await llmQueryAgent.handleEvent(prompt);
            const parsedLabels = JSON.parse(labels);

            console.log(parsedLabels)
            const retrievedLabels = parsedLabels.labels;

            if (retrievedLabels.length > 0) {
                await event.octokit.issues.addLabels({
                    owner,
                    repo,
                    issue_number: pr.number,
                    labels: retrievedLabels,
                });
                this.agentLogger.info(`Labels added: ${retrievedLabels.join(", ")}`);
                message = formatMessage(`
          ### PRLabelAgent Report🤖
          Following labels were added based on the PR information and changes: ${retrievedLabels
                    .map((label) => `**${label}**`)
                    .join(", ")}
        `);
            } else {
                this.agentLogger.info("No labels suggested to add. A comment was added to the PR.");
                message = formatMessage(`
          ### PRLabelAgent Report🤖
          No labels were added based on the PR information and changes.
        `);
            }

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: message,
                pullRequest: true
            });
        } catch (error) {
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            getErrorMsg(this.constructor.name, error);
        }
    }

}

export default WebhookPRLabelAgent;