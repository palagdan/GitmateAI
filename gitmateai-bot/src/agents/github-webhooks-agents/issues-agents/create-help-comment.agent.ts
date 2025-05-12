import {BaseAgent} from "../../base.agent.js";
import {issueCommandsButton, prCommandsButton} from "../../../config/config.js";
import {Context} from "probot";


interface CreateHelpComment {
    context: Context,
    pullRequest?: boolean,
}

class CreateHelpCommentAgent implements BaseAgent<CreateHelpComment, void> {

    private getCommandSection(content: string){
        return `<!-- COMMAND_SECTION -->\n${content}\n<!-- END_COMMAND_SECTION -->`;
    }

    async handleEvent(event: CreateHelpComment): Promise<void> {
        const { owner, repo, issue_number } = event.context.issue();
        const commandButton = event.pullRequest ? this.getCommandSection(prCommandsButton): this.getCommandSection(issueCommandsButton);

        const { data: comments } = await event.context.octokit.issues.listComments({
            owner,
            repo,
            issue_number,
        });

        const botComment = comments.find(comment =>
            comment.user?.login === `${process.env.APP_NAME.toLowerCase()}[bot]`
        );

        let newBody: string;

        if (botComment) {
            const existingBody = botComment.body || "";
            const commandRegex = new RegExp(
                `<!-- COMMAND_SECTION -->[\\s\\S]*?<!-- END_COMMAND_SECTION -->\n?`,
                'g'
            )
            const bodyWithoutAgentCommand = existingBody.replace(commandRegex, '').trim();

            newBody = `${bodyWithoutAgentCommand}\n\n${commandButton}`;

            await event.context.octokit.issues.updateComment({
                owner,
                repo,
                comment_id: botComment.id,
                body: newBody
            });
        } else {
            newBody = `${commandButton}`;
            await event.context.octokit.issues.createComment({
                owner,
                repo,
                issue_number,
                body: newBody
            });
        }
    }
}

export default CreateHelpCommentAgent;