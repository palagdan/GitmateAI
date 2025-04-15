import command from "./commands/command.js";

import {WebhookIssueLabelAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-issue-label.agent.js";
import {HelpWebhookAgent} from "./agents/github-webhooks-agents/help-webhook.agent.js";
import {
    WebhookSummarizeIssueAgent
} from "./agents/github-webhooks-agents/issues-agents/webhook-summarize-issue.agent.js";
import {WebhookSearchIssuesAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-issues.agent.js";
import {WebhookDeleteIssueAgent} from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-delete-issue.agent.js";
import WebhookSaveIssueAgent from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-save-issue.agent.js";
import {PrReviewAgent} from "./agents/github-webhooks-agents/pull-requests-agents/pr-review-agent.js";
import WebhookUpdateIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-update-issue-comment.agent.js";
import WebhookSaveIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-save-issue-comment.agent.js";
import WebhookUpdateIssueAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-update-issue.agent.js";
import WebhookDeleteIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-delete-issue-comment.agent.js";

const issueLabelAgent = new WebhookIssueLabelAgent();
const helpAgent = new HelpWebhookAgent();
const summarizeIssueAgent = new WebhookSummarizeIssueAgent();
const similarIssuesAgent = new WebhookSearchIssuesAgent();
const deleteIssueAgent = new WebhookDeleteIssueAgent();
const saveIssueAgent = new WebhookSaveIssueAgent();
const reviewAgent = new PrReviewAgent();
const updateIssueCommentAgent = new WebhookUpdateIssueCommentAgent();
const saveIssueCommentAgent = new WebhookSaveIssueCommentAgent();
const updateIssueAgent = new WebhookUpdateIssueAgent()
const deleteIssueCommentAgent = new WebhookDeleteIssueCommentAgent();

const webhooks = (app) => {

    app.on(["issues.opened", "issues.edited"], async (context) => {
        await issueLabelAgent.handleEvent(context);
        await saveIssueAgent.handleEvent(context);
    });

    app.on(["issues.edited"], async (context) => {
        await updateIssueAgent.handleEvent(context);
    });


    app.on(["issue_comment.created"], async (context) => {
        await saveIssueCommentAgent.handleEvent(context);
    });

    app.on(["issue_comment.edited"], async (context) => {
        await updateIssueCommentAgent.handleEvent(context);
    });

    app.on(["issues.deleted"], async (context) => {
        await deleteIssueAgent.handleEvent(context);
    })

    app.on(["issue_comment.deleted"], async (context) => {
        await deleteIssueCommentAgent.handleEvent(context);
    });

    app.on(["pull_request.opened", "pull_request.edited"], async (context) => {
        await reviewAgent.handleEvent(context);
    })

    command(app, ["issue_comment.created"], "summarize", async (context) => {
        await summarizeIssueAgent.handleEvent(context);
    })

    command(app, ["issue_comment.created"], "find-similar", async (context) => {
        await similarIssuesAgent.handleEvent(context);
    });


    command(app, ["issue_comment.created"], "help", async (context) => {
        await helpAgent.handleEvent(context);
    })

    command(app, ["issue_comment.created"], "review", async (context) => {
        await reviewAgent.handleEvent(context);
    })




}

export default webhooks;