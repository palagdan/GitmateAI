import {BaseAgent} from "../../../base.agent.js";
import {Context} from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import {IssueContentType, PRContentType} from "../../../../api/types.js";
import logger from "../../../../logger.js";
import {Agent} from "../../../../agent.decorator.js";

@Agent()
class WebhookUpdatePRAgent implements BaseAgent<Context<"pull_request.edited">, void>{

    async handleEvent(event: Context<"pull_request.edited">): Promise<void> {
        try{
            const pr = event.payload.pull_request;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;
            const prNumber = pr.number;

            console.log(pr.title)
            await gitmateai.prChunks.update({
                content: pr.title,
                owner: owner,
                repo: repo,
                prNumber: prNumber,
                author: pr.user.login,
                type: PRContentType.Title,
            });
            await gitmateai.prChunks.update({
                content: pr.body,
                owner: owner,
                repo: repo,
                prNumber: prNumber,
                author: pr.user.login,
                type: PRContentType.Description,
            });

            logger.info(`Chunks for PR ${owner}/${repo}/${prNumber} of type ${IssueContentType.Title} and ${IssueContentType.Description} are updated successfully!`);
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookUpdatePRAgent;