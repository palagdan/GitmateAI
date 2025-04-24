import { Context } from "probot";
import { LLMAgent } from "../../LLMAgent.js";
import { formatMessage, getErrorMsg } from "../../../messages/messages.js";
import IssueLabelAgent from "../../common/issues-agents/issue-label.agent.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../../common/llm-query.agent.js";

export class WebhookIssueLabelAgent extends LLMAgent<Context<"issues">, void> {
    async handleEvent(event: Context<"issues">): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = event.payload.issue;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;


            const availableLabels = await event.octokit.issues.listLabelsForRepo({
                owner,
                repo,
            });

            const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.LABEL_ISSUE, {
                title: issue.title,
                description: issue.body,
                availableLabels: availableLabels.data.join(", ")
            });

            const llmQueryAgent = new LLMQueryAgent();
            const result = await llmQueryAgent.handleEvent(prompt);
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
}