import {Context} from "probot";

import {summarizeDiff} from "./utils.js";
import {LLMAgent} from "../../../LLMAgent.js";
import {PR_AGENT_PROMPTS} from "../../../../prompts.js";
import LLMQueryAgent from "../../../common/llm-query.agent.js";
import {formatMessage, getErrorMsg} from "../../../../messages/messages.js";
import CreateIssueCommentAgent from "../create-issue-comment.agent.js";

export class WebhookPRLabelAgent extends LLMAgent< Context<"pull_request"> | Context<"issue_comment.created">, void> {

    async handleEvent(event: Context<"pull_request"> | Context<"issue_comment.created">): Promise<void> {
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


            if (pr.labels && pr.labels.length > 0) {
                await event.octokit.issues.removeAllLabels({
                    owner,
                    repo,
                    issue_number: pr.number,
                });
                this.agentLogger.info(`Removed existing labels from PR #${pr.number}`);
            }

            const files = await event.octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: pr.number
            });

            const changes = `${files.data.map(file => `- ${file.filename} (${file.changes} changes)\nDiff summary: ${summarizeDiff(file.patch)}`).join('\n')}`;

            const availableLabels = await event.octokit.issues.listLabelsForRepo({
                owner,
                repo,
            });

            const prompt = this.createPrompt(PR_AGENT_PROMPTS.LABEL_PR, {
                title: pr.title,
                description: pr.body,
                changes: changes,
                availableLabels: availableLabels.data.map((label) => label.name).join(", ")
            });

            const llmQueryAgent = new LLMQueryAgent();
            const labels = await llmQueryAgent.handleEvent(prompt);
            const parsedLabels = JSON.parse(labels);
            const retrievedLabels = parsedLabels.labels;
            const explanation = parsedLabels.explanation;

            if (retrievedLabels.length > 0) {
                await event.octokit.issues.addLabels({
                    owner,
                    repo,
                    issue_number: pr.number,
                    labels: retrievedLabels,
                });
                this.agentLogger.info(`Labels added: ${retrievedLabels.join(", ")}`);

            } else {
                this.agentLogger.info("No labels suggested to add. A comment was added to the PR.");
            }

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: `## LabelPRAgent Report 🤖\n${explanation}`,
                pullRequest: true,
                agentId: this.constructor.name
            });
        } catch (error) {
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(this.constructor.name, error),
                pullRequest: true,
                agentId: this.constructor.name
            })
        }
    }

    getService(): string {
        return "pr-label";
    }
}

export default WebhookPRLabelAgent;