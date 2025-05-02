import { BaseAgent } from "../../../base.agent.js";
import { Context } from "probot";
import gitmateai from "../../../../api/gitmateai-rest.js";
import logger from "../../../../logger.js";
import {IssueContentType, PRContentType} from "../../../../api/types.js";

class WebhookSavePRAgent implements BaseAgent<Context<"pull_request">, void> {

    async handleEvent(event: Context<"pull_request">): Promise<void> {
        try {
            const pr = event.payload.pull_request;
            const owner = event.payload.repository.owner.login;
            const repo = event.payload.repository.name;
            const prNumber = pr.number;

            await gitmateai.prChunks.insert({
                content: pr.title,
                owner,
                repo,
                prNumber: prNumber,
                author: pr.user.login,
                type: PRContentType.Title,
            });
            await gitmateai.prChunks.insert({
                content: pr.body || "",
                owner,
                repo,
                prNumber: prNumber,
                author: pr.user.login,
                type: PRContentType.Description,
            });

            logger.info(`Chunks for PR ${owner}/${repo}/${prNumber} of type ${PRContentType.Title} and ${PRContentType.Description} are inserted successfully!`);
        } catch (error) {
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}

export default WebhookSavePRAgent;