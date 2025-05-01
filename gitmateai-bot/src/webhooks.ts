import command from "./commands/command.js";

import {WebhookIssueLabelAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-issue-label.agent.js";
import {
    WebhookSummarizeIssueAgent
} from "./agents/github-webhooks-agents/issues-agents/webhook-summarize-issue.agent.js";
import {WebhookSearchIssuesAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-issues.agent.js";
import {WebhookDeleteIssueAgent} from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-delete-issue.agent.js";
import WebhookSaveIssueAgent from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-save-issue.agent.js";
import WebhookUpdateIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-update-issue-comment.agent.js";
import WebhookSaveIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-save-issue-comment.agent.js";
import WebhookUpdateIssueAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-update-issue.agent.js";
import WebhookDeleteIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-issues-agents/webhook-delete-issue-comment.agent.js";
import {Context} from "probot";
import WebhookPRLabelAgent
    from "./agents/github-webhooks-agents/issues-agents/pull-requests-agents/webhook-pr-label-agent.js";
import {isPullRequest} from "./utils/github-utils.js";
import WebhookSummarizePRAgent
    from "./agents/github-webhooks-agents/issues-agents/pull-requests-agents/webhook-summarize-pr.agent.js";
import WebhookSearchCommitsAgent from "./agents/github-webhooks-agents/issues-agents/webhook-search-commits.agent.js";
import {servicesConfig} from "./config/config.js";

const issueLabelAgent = new WebhookIssueLabelAgent();
const summarizeIssueAgent = new WebhookSummarizeIssueAgent();
const searchIssuesAgent = new WebhookSearchIssuesAgent();
const deleteIssueAgent = new WebhookDeleteIssueAgent();
const saveIssueAgent = new WebhookSaveIssueAgent();
const updateIssueCommentAgent = new WebhookUpdateIssueCommentAgent();
const saveIssueCommentAgent = new WebhookSaveIssueCommentAgent();
const updateIssueAgent = new WebhookUpdateIssueAgent()
const deleteIssueCommentAgent = new WebhookDeleteIssueCommentAgent();
const prLabelAgent = new WebhookPRLabelAgent();
const summarizePRAgent = new WebhookSummarizePRAgent();
const searchCommitsAgent = new WebhookSearchCommitsAgent();

const webhooks = (app) => {

    // Issues ---------------------------------------------------------------------
    app.on(["issues.opened"], async (context: Context<"issues.opened">) => {
        await run(context, issueLabelAgent);
        await run(context, summarizeIssueAgent);
        await run(context, searchIssuesAgent);
        await run(context, searchCommitsAgent);

        await saveIssueAgent.handleEvent(context);
    });

    app.on(["issues.edited"], async (context: Context<"issues.edited">) => {
        await updateIssueAgent.handleEvent(context);
    });

    app.on(["issues.deleted"], async (context: Context<"issues.deleted">) => {
        await deleteIssueAgent.handleEvent(context);
    })

    app.on(["issue_comment.created", ], async (context: Context<"issue_comment.created">) => {
        await saveIssueCommentAgent.handleEvent(context);
    });

    app.on(["issue_comment.edited"], async (context: Context<"issue_comment.edited">) => {
        await updateIssueCommentAgent.handleEvent(context);
    });

    app.on(["issue_comment.deleted"], async (context: Context<"issue_comment.deleted">) => {
        await deleteIssueCommentAgent.handleEvent(context);
    });

    // PRs ---------------------------------------------------------------------

    app.on(["pull_request.opened"], async (context: Context<"pull_request.opened">) => {
        await run(context, prLabelAgent);
        await run(context, summarizePRAgent);
    });

    // commands ---------------------------------------------------------------------

    command(app, ["issue_comment.created", "issue_comment.edited"], "label", async (context: Context) => {
        if(isPullRequest(context)){
            await prLabelAgent.handleEvent(context);
        }else{
            await issueLabelAgent.handleEvent(context);
        }
    });

    command(app, ["issue_comment.created", "issue_comment.edited"], "summarize", async (context: Context) => {
        if(isPullRequest(context)) {
            await summarizePRAgent.handleEvent(context);
        }else{
            await summarizeIssueAgent.handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-issues", async (context: Context) => {
        if(!isPullRequest(context)){
            await searchIssuesAgent.handleEvent(context);
        }
    });

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-commits", async(context: Context)=> {
        if(!isPullRequest(context)){
            await searchCommitsAgent.handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-code", async(context: Context)=> {
        if(!isPullRequest(context)){
            await searchCommitsAgent.handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-pull-requests", async(context: Context)=> {
        if(!isPullRequest(context)){
            await searchCommitsAgent.handleEvent(context);
        }
    })
}


const run = async (context: Context, agent) => {
    const repo = context.repo();
    if(servicesConfig[repo.owner][repo.repo] && servicesConfig[repo.owner][repo.repo].automatedServices.includes(agent.getService())){
        await agent.handleEvent(context);
    }
}

export default webhooks;