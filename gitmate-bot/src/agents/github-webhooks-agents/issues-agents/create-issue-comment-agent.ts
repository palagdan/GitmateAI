import {BaseAgent} from "../../base-agent.js";
import {Context} from "probot";

interface CreateIssueComment{
    context: Context,
    values: string[]
}

class CreateIssueCommentAgent implements BaseAgent<CreateIssueComment, void>{

    async handleEvent(event: CreateIssueComment): Promise<void> {
        const {owner, repo, issue_number} = event.context.issue();
        const body = event.values.join('\n');
        await event.context.octokit.issues.createComment({
            owner,
            repo,
            issue_number: issue_number,
            body: body
        });
    }

}

export default CreateIssueCommentAgent;