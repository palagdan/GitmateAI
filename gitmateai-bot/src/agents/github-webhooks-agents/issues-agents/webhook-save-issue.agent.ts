import {BaseAgent} from "../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../api/gitmateai-rest.js";
import {getErrorMsg} from "../../../messages/messages.js";
import logger from "../../../logger.js";
import CreateIssueCommentAgent from "./create-issue-comment.agent.js";


export class WebhookSaveIssueAgent implements BaseAgent<Context, void>{

    async handleEvent(event: Context): Promise<void> {
        const createIssueCommentAgent = new CreateIssueCommentAgent();
        try{
            const {owner, repo, issue_number} = event.issue();
            const issue = await event.octokit.issues.get({ owner, repo, issue_number });
            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;
            await gitmateai.issueChunks.insert({
                content: issueText,
                owner: owner,
                repo: repo,
                issue: issue_number,
            });
            logger.info(`Chunks for ${owner}/${repo}/${issue_number} are inserted successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
            await createIssueCommentAgent.handleEvent({
                context: event,
                value: getErrorMsg(this.constructor.name, error)
            });
        }
    }

}