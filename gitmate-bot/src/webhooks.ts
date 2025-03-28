import command from "./commands/command.js";
import {isPullRequest} from "./utils/github-utils.js";
import {OctokitGitHubService} from "./services/github-service.js";
import {IssueLabelWebhookAgent} from "./agents/github-webhooks-agents/issues-agents/issue-label-webhook.agent.js";
import {HelpWebhookAgent} from "./agents/github-webhooks-agents/help-webhook.agent.js";
import {SummarizeIssueWebhookAgent} from "./agents/github-webhooks-agents/issues-agents/summarize-issue-webhook.agent.js";
import {SimilarIssuesDetectorWebhookAgent} from "./agents/github-webhooks-agents/issues-agents/similar-issues-detector-webhook.agent.js";
import {DeleteIssueWebhookAgent} from "./agents/github-webhooks-agents/issues-agents/delete-issue-webhook.agent.js";
import {SaveIssueWebhookAgent} from "./agents/github-webhooks-agents/issues-agents/save-issue-webhook.agent.js";
import CreateIssueCommentAgent from "./agents/github-webhooks-agents/issues-agents/create-issue-comment.agent.js";
import {PrReviewAgent} from "./agents/github-webhooks-agents/pull-requests-agents/pr-review-agent.js";

const githubService = new OctokitGitHubService();
const issueLabelAgent = new IssueLabelWebhookAgent(githubService);
const helpAgent = new HelpWebhookAgent();
const summarizeIssueAgent = new SummarizeIssueWebhookAgent(githubService);
const similarIssuesAgent = new SimilarIssuesDetectorWebhookAgent();
const deleteIssueAgent = new DeleteIssueWebhookAgent();
const saveIssueAgent = new SaveIssueWebhookAgent();

const createIssueCommentAgent = new CreateIssueCommentAgent();
const reviewAgent = new PrReviewAgent();


const webhooks = (app) =>{

    app.on(["issues.opened", "issues.edited"], async (context) => {
        const labelAgentResponse = await issueLabelAgent.handleEvent(context);
        const similarIssueAgentResponse = await similarIssuesAgent.handleEvent(context);
        const saveIssueAgentResponse = await saveIssueAgent.handleEvent(context);
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