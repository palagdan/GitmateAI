import {BaseAgent} from "../../base-agent.js";
import {Context} from "probot";
import gitmate from "../../../api/gitmate-rest.js";
import {formatMessage, getErrorMsg} from "../../../messages/messages.js";


export class SaveIssueAgent implements BaseAgent<Context, string>{

    async handleEvent(event: Context): Promise<string> {
        try{
            const {owner, repo, issue_number} = event.issue();
            const issue = await event.octokit.issues.get({ owner, repo, issue_number });
            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;
            await gitmate.issueChunks.insert({
                content: issueText,
                owner: owner,
                repo: repo,
                issue: issue_number,
            });
            event.log.info(`Chunks for ${owner}/${repo}/${issue_number} are inserted successfully!`);
            return formatMessage(`
            ### SaveIssueAgent Report 🤖
            
            Chunks for ${owner}/${repo}/${issue_number} are inserted successfully!
            `)
        }catch (error){
            event.log.error(`Error occurred: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }

}