import {LlmAgent} from "../../llm-agent.js";
import {Context} from "probot";
import {isPullRequest} from "../../../utils/github-utils.js";
import {getErrorMsg} from "../../../messages/messages.js";


function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class PrReviewAgent extends LlmAgent<Context, void> {

    async handleEvent(event): Promise<void> {
        const {owner, repo, issue_number} = event.issue();
        const {payload} = event;

        if(!isPullRequest(event)){
            await event.octokit.issues.createComment({
                owner,
                repo,
                issue_number: issue_number,
                body: getErrorMsg(this.constructor.name ,"This is not a pull request!"),
            });
        }

        const headSha = payload.pull_request.head.sha;

        const checkRun = await event.octokit.checks.create({
            owner,
            repo: repo,
            name: "MySonarBot",
            head_sha: headSha,
            status: "in_progress",
            output: {
                title: "SonarQube Analysis",
                summary: "Analysis in progress...",
            },
        });

        const checkRunId = checkRun.data.id;

        await sleep(5000)

        await event.octokit.checks.update({
            owner,
            repo: repo,
            check_run_id: checkRunId,
            status: "completed",
            conclusion: "success",
            completed_at: new Date().toISOString(),
            output: {
                title: "Gitmate Analysis Completed",
            },
        });


    }


}