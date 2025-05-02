import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import logger from "../../../../logger.js";


export class WebhookDeleteIssueAgent implements BaseAgent<Context<"issues">, void>{

    async handleEvent(event: Context<"issues">): Promise<void> {
        try{
            const {owner, repo, issue_number} = event.issue();
            await gitmateai.issueChunks.deleteByOwnerRepoIssue({
                owner: owner,
                repo: repo,
                issueNumber: issue_number,
            });
            logger.info(`Chunks for issue ${owner}/${repo}/${issue_number} are deleted successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}