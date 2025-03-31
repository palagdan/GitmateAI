import { BaseAgent } from "../base.agent.js";
import { Context } from "probot";
import {helpMessage} from "../../config/config.js";


export class HelpWebhookAgent implements BaseAgent<Context, void> {

    async handleEvent(event: Context): Promise<void> {
        const {owner, repo, issue_number} = event.issue();
        await event.octokit.issues.createComment({
            owner,
            repo,
            issue_number: issue_number,
            body: helpMessage,
        });
    }
}