import { Context } from "probot";
import { LLMAgent } from "../../llm-agent.js";
import {  getErrorMsg } from "../../../messages/messages.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import {Agent} from "../../../agent.decorator.js";
import {llmClient} from "../../../llm-client.js";

@Agent()
export class WebhookIssueLabelAgent extends LLMAgent<Context<"issues"> | Context<"issue_comment.created">, void> {


    async handleEvent(event:  Context<"issues"> | Context<"issue_comment.created">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;
            const issue_number = issue.number;

            const { data: comments } = await event.octokit.issues.listComments({
                owner,
                repo,
                issue_number,
            });

            if (issue.labels && issue.labels.length > 0) {
                await event.octokit.issues.removeAllLabels({
                    owner,
                    repo,
                    issue_number: issue.number,
                });
                this.agentLogger.info(`Removed existing labels from issue #${issue.number}`);
            }

            const availableLabels = await event.octokit.issues.listLabelsForRepo({
                owner,
                repo,
            });

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.LABEL_ISSUE, {
                title: issue.title,
                description: issue.body,
                availableLabels: availableLabels.data.map(label => label.name).join(", "),
                comments: comments
                    .map((comment) => `Comment by ${comment.user.login}:\n${comment.body}`)
                    .join("\n\n")
            });

            const result = await llmClient.generateCompletion(prompt);
            const parsedResult = JSON.parse(result);
            const retrievedLabels = parsedResult.labels;
            const explanation = parsedResult.explanation;

            if (retrievedLabels.length > 0) {
                await event.octokit.issues.addLabels({
                    owner,
                    repo,
                    issue_number: issue.number,
                    labels: retrievedLabels,
                });
                this.agentLogger.info(`Labels added: ${retrievedLabels.join(", ")}`)
            }

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: `## LabelIssueAgent Report 🤖\n${explanation}`,
                pullRequest: false,
                agentId: this.constructor.name
            });
        } catch (error) {
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(error, this.constructor.name),
                pullRequest: false,
                agentId: this.constructor.name
            });
        }
    }

    getService(): string {
        return "issue-label";
    }

}