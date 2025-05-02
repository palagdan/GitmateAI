import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import {IssueContentType} from "../../../../api/types.js";
import logger from "../../../../logger.js";


class WebhookUpdateIssueCommentAgent implements BaseAgent<Context<"issue_comment">, void>{

    async handleEvent(event: Context<"issue_comment">): Promise<void> {
        const comment = event.payload.comment;
        const {owner, repo, issue_number} = event.issue();
        try{
            await gitmateai.issueChunks.update({
                content: comment.body,
                owner: owner,
                repo: repo,
                issueNumber: issue_number,
                author: comment.user.login,
                type: IssueContentType.Comment,
                commentId: comment.id
            });
            logger.info(`Chunks for issue ${owner}/${repo}/${issue_number} of type ${IssueContentType.Comment} are updated successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookUpdateIssueCommentAgent;