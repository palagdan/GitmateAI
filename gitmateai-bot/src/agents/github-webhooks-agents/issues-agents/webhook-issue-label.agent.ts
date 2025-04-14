import { Context } from "probot";
import { LLMAgent } from "../../LLMAgent.js";
import { formatMessage, getErrorMsg } from "../../../messages/messages.js";
import IssueLabelAgent from "../../common/issues-agents/issue-label.agent.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";

export class WebhookIssueLabelAgent extends LLMAgent<Context<"issues">, void> {
    async handleEvent(event: Context<"issues">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;
            const context = `${issue.title}\n\n${issue.body || ""}`;

            const availableLabels = await event.octokit.issues.listLabelsForRepo({
                owner,
                repo,
            });

            const labelIssueAgent = new IssueLabelAgent();
            const retrievedLabels = await labelIssueAgent.handleEvent({
                issueInformation: context,
                availableLabels: availableLabels.data.map((label) => label.name),
            });

            let message: string;

            if (retrievedLabels.length > 0) {
                await event.octokit.issues.addLabels({
                    owner,
                    repo,
                    issue_number: issue.number,
                    labels: retrievedLabels,
                });
                this.agentLogger.info(`Labels added: ${retrievedLabels.join(", ")}`);
                message = formatMessage(`
          ### IssueLabelAgent Report🤖
          Following labels were added based on the provided information: ${retrievedLabels
                    .map((label) => `**${label}**`)
                    .join(", ")}
        `);
            } else {
                this.agentLogger.info("No labels suggested to add. A comment was added to the issue.");
                message = formatMessage(`
          ### IssueLabelAgent Report🤖
          No labels were added based on the provided information.
        `);
            }

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: message,
            });
        } catch (error) {
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            getErrorMsg(this.constructor.name, error);
        }
    }
}