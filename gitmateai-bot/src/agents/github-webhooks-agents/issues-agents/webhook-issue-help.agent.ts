import {BaseAgent} from "../../base.agent.js";
import {Agent} from "../../../agent.decorator.js";
import {Context} from "probot";
import logger from "../../../logger.js";
import CreateHelpCommentAgent from "./create-help-comment.agent.js";
import {isPullRequest} from "../../../utils/github-utils.js";


@Agent()
export class WebhookIssueHelpAgent implements BaseAgent<Context<"issue_comment.created"> | Context<"issue_comment.edited">, void>{

    async handleEvent(event: Context<"issue_comment.created"> | Context<"issue_comment.edited">): Promise<void> {

        const createHelpCommentAgent = new CreateHelpCommentAgent();
        try{
            if(isPullRequest(event)) {
                await createHelpCommentAgent.handleEvent({
                    context: event,
                    pullRequest: true,
                });
            }else{
                await createHelpCommentAgent.handleEvent({
                    context: event,
                    pullRequest: false,
                });
            }
        }catch (error){
            logger.error(`Error occurred: ${(error as Error).message}`);
        }
    }
}