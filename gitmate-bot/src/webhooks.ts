import command from "./commands/command.js";
import {isPullRequest} from "./utils/github-utils.js";
import OpenAI from "openai";
import {OctokitGitHubService} from "./services/github-service.js";
import {IssueLabelAgent} from "./agents/github-agents/issues-agents/issue-label-agent.js";
import {HelpAgent} from "./agents/github-agents/help-agent.js";
import {SummarizeIssueAgent} from "./agents/github-agents/issues-agents/summarize-issue-agent.js";
import {SimilarIssuesDetectorAgent} from "./agents/github-agents/issues-agents/similar-issues-detector-agent.js";
import {DeleteIssueAgent} from "./agents/github-agents/issues-agents/delete-issue-agent.js";
import {SaveIssueAgent} from "./agents/github-agents/issues-agents/save-issue-agent.js";
import CreateIssueCommentAgent from "./agents/github-agents/issues-agents/create-issue-comment-agent.js";
import {PrReviewAgent} from "./agents/github-agents/pull-requests-agents/pr-review-agent.js";

const githubService = new OctokitGitHubService();
const issueLabelAgent = new IssueLabelAgent(githubService);
const helpAgent = new HelpAgent();
const summarizeIssueAgent = new SummarizeIssueAgent(githubService);
const similarIssuesAgent = new SimilarIssuesDetectorAgent();
const deleteIssueAgent = new DeleteIssueAgent();
const saveIssueAgent = new SaveIssueAgent();

const createIssueCommentAgent = new CreateIssueCommentAgent();
const reviewAgent = new PrReviewAgent(githubService);


const webhooks = (app) =>{

    app.on(["issues.opened", "issues.edited"], async (context) => {
        const labelAgentResponse = await issueLabelAgent.handleEvent(context);
        const similarIssueAgentResponse = await similarIssuesAgent.handleEvent(context);
        const saveIssueAgentResponse = await saveIssueAgent.handleEvent(context);
        await createIssueCommentAgent.handleEvent({
            context: context,
            values: [labelAgentResponse, similarIssueAgentResponse, saveIssueAgentResponse]
        })
    });

    app.on(["pull_request.opened", "pull_request.edited"], async (context) => {
        await reviewAgent.handleEvent(context);
    })

    command(app, ["issue_comment.created"], "summarize", async (context) => {
        if (isPullRequest(context)) {
            // summarize PR
        } else {
            await summarizeIssueAgent.handleEvent(context);
        }
    })


    command(app, ["issue_comment.created"], "help", async (context) => {
        await helpAgent.handleEvent(context);
    })

    command(app, ["issue_comment.created"], "review", async (context) => {
        await reviewAgent.handleEvent(context);
    })


    app.on("issues.deleted", async (context) => {
        await deleteIssueAgent.handleEvent(context);
    })
}

export default webhooks;