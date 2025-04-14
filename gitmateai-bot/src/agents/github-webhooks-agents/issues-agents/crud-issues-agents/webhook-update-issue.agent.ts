import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import {IssueContentType} from "../../../../api/types.js";
import logger from "../../../../logger.js";

class WebhookUpdateIssueAgent implements BaseAgent<Context<"issues">, void>{

    async handleEvent(event: Context<"issues">): Promise<void> {
        try{
            const {owner, repo, issue_number} = event.issue();
            const issue: any = await event.octokit.issues.get({ owner, repo, issue_number });

            await gitmateai.issueChunks.update({
                content: issue.data.title,
                owner: owner,
                repo: repo,
                issueNumber: issue_number,
                author: issue.user.login,
                type: IssueContentType.Title,
            });
            await gitmateai.issueChunks.update({
                content: issue.data.description,
                owner: owner,
                repo: repo,
                issueNumber: issue_number,
                author: issue.user.login,
                type: IssueContentType.Description,
            });

            logger.info(`Chunks for ${owner}/${repo}/${issue_number} of type ${IssueContentType.Title} and ${IssueContentType.Description} are updated successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookUpdateIssueAgent;