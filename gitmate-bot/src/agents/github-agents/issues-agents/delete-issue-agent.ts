import {BaseAgent} from "../../base-agent.js";
import {Context} from "probot";
import gitmate from "../../../api/gitmate-rest.js";


export class DeleteIssueAgent implements BaseAgent<Context, void>{

    async handleEvent(event: Context): Promise<void> {
        try{
            const {owner, repo, issue_number} = event.issue();
            await gitmate.issueChunks.deleteByOwnerRepoIssue(owner, repo, issue_number);
            event.log.info(`Chunks for ${owner}/${repo}/${issue_number} are deleted successfully!`);
        }catch (error){
            event.log.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}