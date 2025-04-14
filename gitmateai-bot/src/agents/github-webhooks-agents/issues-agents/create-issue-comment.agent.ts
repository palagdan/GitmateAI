import {BaseAgent} from "../../base.agent.js";
import {Context} from "probot";
import {commandsButton} from "../../../config/config.js";

interface CreateIssueComment {
    context: Context,
    value: string
}


class CreateIssueCommentAgent implements BaseAgent<CreateIssueComment, void> {

    async handleEvent(event: CreateIssueComment): Promise<void> {
        const { owner, repo, issue_number } = event.context.issue();
        const comments = await event.context.octokit.issues.listComments({
            owner,
            repo,
            issue_number,
        });

        const botComments = comments.data.filter(comment => {
            return comment.user?.login === `${process.env.APP_NAME.toLowerCase()}[bot]`;
        });

        if (botComments.length > 0) {
            const botCommentBody = botComments[0].body || "";
            const bodyWithoutCommandsButton = botCommentBody.replace(commandsButton, "").trim();
            const updatedBody = `${bodyWithoutCommandsButton}\n\n${event.value}\n\n${commandsButton}`;
            await event.context.octokit.issues.updateComment({
                owner,
                repo,
                comment_id: botComments[0].id,
                body: updatedBody
            });
            return;
        }


        const body = `${event.value}\n\n${commandsButton}`;
        await event.context.octokit.issues.createComment({
            owner,
            repo,
            issue_number: issue_number,
            body: body
        });
    }
}

export default CreateIssueCommentAgent;