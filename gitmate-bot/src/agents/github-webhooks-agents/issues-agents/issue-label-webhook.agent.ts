import {Context} from "probot";
import {LlmAgent} from "../../llm.agent.js";
import {GitHubService} from "../../../services/github-service.js";
import {formatMessage, getErrorMsg} from "../../../messages/messages.js";
import logger from "../../../logger.js";
import IssueLabelAgent from "../../common/issue-label.agent.js";



export class IssueLabelWebhookAgent extends LlmAgent<Context, void> {

    constructor(private gitHubService: GitHubService) {
        super();
    }

    async handleEvent(event: Context): Promise<void> {
        try {
            const issue = await this.gitHubService.getIssue(event);
            const context = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const availableLabels: string[] = await this.gitHubService.listLabelsForRepo(event);

            const labelIssueAgent = new IssueLabelAgent();

            const retrievedLabels = await labelIssueAgent.handleEvent({
                issueInformation: context,
                availableLabels: availableLabels
            })

            if (retrievedLabels.length > 0) {
                await this.gitHubService.addLabels(event, retrievedLabels);
                logger.info(`Labels added: ${retrievedLabels.join(", ")}`);
                formatMessage(`
                ### IssueLabelAgent Report🤖
                Following labels were added based on the provided information: ${retrievedLabels.map(label => `**${label}**`).join(", ")}`
                );

            } else {
                logger.info("No labels suggested to add. A comment was added to the issue.");
                formatMessage(`
                ### IssueLabelAgent Report🤖

                No labels were added based on the provided information.
                `);
            }

        } catch (error) {
            logger.error(`Error occurred: ${(error as Error).message}`);
            getErrorMsg(this.constructor.name, error);
        }
    }


}
