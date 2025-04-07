import {Context} from "probot";
import {LLMAgent} from "../../LLMAgent.js";
import {GitHubService} from "../../../services/github-service.js";
import {formatMessage, getErrorMsg} from "../../../messages/messages.js";
import IssueLabelAgent from "../../common/issues-agents/issue-label.agent.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";


export class WebhookIssueLabelAgent extends LLMAgent<Context, void> {

    constructor(private gitHubService: GitHubService) {
        super();
    }

    async handleEvent(event: Context): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try {
            const issue = await this.gitHubService.getIssue(event);
            const context = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const availableLabels = await this.gitHubService.listLabelsForRepo(event);

            const labelIssueAgent = new IssueLabelAgent();
            const retrievedLabels = await labelIssueAgent.handleEvent({
                issueInformation: context,
                availableLabels: availableLabels.data.map(label  => label.name)
            })

            let message: string;

            if (retrievedLabels.length > 0) {
                await this.gitHubService.addLabels(event, retrievedLabels);
                this.agentLogger.info(`Labels added: ${retrievedLabels.join(", ")}`);
                message = formatMessage(`
                ### IssueLabelAgent Report🤖
                Following labels were added based on the provided information: ${retrievedLabels.map(label => `**${label}**`).join(", ")}`
                );

            } else {
                this.agentLogger.info("No labels suggested to add. A comment was added to the issue.");
                message = formatMessage(`
                ### IssueLabelAgent Report🤖

                No labels were added based on the provided information.
                `);
            }

            await createIssueCommentAgent.handleEvent({
                context: event,
                value: message
            })

        } catch (error) {
            this.agentLogger.error(`Error occurred: ${(error as Error).message}`);
            getErrorMsg(this.constructor.name, error);
        }
    }


}
