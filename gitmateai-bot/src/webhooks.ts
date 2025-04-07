import command from "./commands/command.js";
import {isPullRequest} from "./utils/github-utils.js";
import {OctokitGitHubService} from "./services/github-service.js";
import {WebhookIssueLabelAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-issue-label.agent.js";
import {HelpWebhookAgent} from "./agents/github-webhooks-agents/help-webhook.agent.js";
import {WebhookSummarizeIssueAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-summarize-issue.agent.js";
import {WebhookSearchIssuesAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-issues.agent.js";
import {WebhookDeleteIssueAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-delete-issue.agent.js";
import {WebhookSaveIssueAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-save-issue.agent.js";
import CreateIssueCommentAgent from "./agents/github-webhooks-agents/issues-agents/create-issue-comment.agent.js";
import {PrReviewAgent} from "./agents/github-webhooks-agents/pull-requests-agents/pr-review-agent.js";

const githubService = new OctokitGitHubService();
const issueLabelAgent = new WebhookIssueLabelAgent(githubService);
const helpAgent = new HelpWebhookAgent();
const summarizeIssueAgent = new WebhookSummarizeIssueAgent(githubService);
const similarIssuesAgent = new WebhookSearchIssuesAgent();
const deleteIssueAgent = new WebhookDeleteIssueAgent();
const saveIssueAgent = new WebhookSaveIssueAgent();

const createIssueCommentAgent = new CreateIssueCommentAgent();
const reviewAgent = new PrReviewAgent();


const webhooks = (app) =>{

    app.on(["issues.opened", "issues.edited"], async (context) => {
        await issueLabelAgent.handleEvent(context);
        await similarIssuesAgent.handleEvent(context);
        await saveIssueAgent.handleEvent(context);
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