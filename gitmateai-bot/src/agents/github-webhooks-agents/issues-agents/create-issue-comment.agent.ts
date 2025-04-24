import {BaseAgent} from "../../base.agent.js";
import {Context} from "probot";
import {issueCommandsButton, prCommandsButton} from "../../../config/config.js";

interface CreateIssueComment {
    context: Context,
    value: string,
    pullRequest?: boolean,
    agentId: string,
}

class CreateIssueCommentAgent implements BaseAgent<CreateIssueComment, void> {
    private getAgentSection(agentId: string, content: string): string {
        return `<!-- AGENT_SECTION:${agentId} -->\n${content}\n<!-- END_AGENT_SECTION:${agentId} -->`;
    }

    private getCommandSection(content: string){
        return `<!-- COMMAND_SECTION -->\n${content}\n<!-- END_COMMAND_SECTION -->`;
    }

    async handleEvent(event: CreateIssueComment): Promise<void> {
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

        const agentSection = this.getAgentSection(event.agentId, event.value);
        let newBody: string;

        if (botComment) {
            const existingBody = botComment.body || "";
            const sectionRegex = new RegExp(
                `<!-- AGENT_SECTION:${event.agentId} -->[\\s\\S]*?<!-- END_AGENT_SECTION:${event.agentId} -->\n?`,
                'g'
            );
            const commandRegex = new RegExp(
                `<!-- COMMAND_SECTION -->[\\s\\S]*?<!-- END_COMMAND_SECTION -->\n?`,
                'g'
            )
            const bodyWithoutAgentCommand = existingBody.replace(sectionRegex, '').replace(commandRegex, '').trim();

            newBody = `${bodyWithoutAgentCommand}\n\n${agentSection}\n\n${commandButton}`;

            await event.context.octokit.issues.updateComment({
                owner,
                repo,
                comment_id: botComment.id,
                body: newBody
            });
        } else {
            newBody = `${agentSection}\n\n${commandButton}`;
            await event.context.octokit.issues.createComment({
                owner,
                repo,
                issue_number,
                body: newBody
            });
        }
    }
}

export default CreateIssueCommentAgent;