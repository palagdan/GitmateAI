import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import {IssueContentType, PRContentType} from "../../../../api/types.js";
import logger from "../../../../logger.js";
import {Agent} from "../../../../agent.decorator.js";


@Agent()
class WebhookSavePRCommentAgent implements BaseAgent<Context<"issue_comment.created">, void>{

    async handleEvent(event: Context<"issue_comment.created">): Promise<void> {
        const comment = event.payload.comment;
        const {owner, repo, issue_number} = event.issue();
        try{
            await gitmateai.prChunks.insert({
                content: comment.body,
                owner: owner,
                repo: repo,
                prNumber: issue_number,
                author: comment.user.login,
                type: PRContentType.Comment,
                commentId: comment.id
            });
            logger.info(`Chunks for issue ${owner}/${repo}/${issue_number} of type ${IssueContentType.Comment} are saved successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookSavePRCommentAgent;