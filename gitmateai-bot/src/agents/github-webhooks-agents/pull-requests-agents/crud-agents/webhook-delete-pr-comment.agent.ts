import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import {PRContentType} from "../../../../api/types.js";
import logger from "../../../../logger.js";


class WebhookDeletePRCommentAgent implements BaseAgent<Context<"issue_comment.deleted">, void>{

    async handleEvent(event: Context<"issue_comment.deleted">): Promise<void> {
        const comment = event.payload.comment;
        const {owner, repo, issue_number} = event.issue();
        try{
            await gitmateai.prChunks.deleteCommentByOwnerRepoIssueCommentId(
                {
                    owner: owner,
                    repo: repo,
                    prNumber: issue_number,
                    commentId: comment.id,
                }
            );
            logger.info(`Chunks for PR ${owner}/${repo}/${issue_number} of type ${PRContentType.Comment} are deleted successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookDeletePRCommentAgent;