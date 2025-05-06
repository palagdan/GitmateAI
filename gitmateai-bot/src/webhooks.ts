import command from "./commands/command.js";

import {WebhookIssueLabelAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-issue-label.agent.js";
import {
    WebhookSummarizeIssueAgent
} from "./agents/github-webhooks-agents/issues-agents/webhook-summarize-issue.agent.js";
import {WebhookSearchIssuesAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-issues.agent.js";
import {WebhookDeleteIssueAgent} from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-delete-issue.agent.js";
import WebhookSaveIssueAgent from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-save-issue.agent.js";
import WebhookUpdateIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-update-issue-comment.agent.js";
import WebhookSaveIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-save-issue-comment.agent.js";
import WebhookUpdateIssueAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-update-issue.agent.js";
import WebhookDeleteIssueCommentAgent
    from "./agents/github-webhooks-agents/issues-agents/crud-agents/webhook-delete-issue-comment.agent.js";
import {Context} from "probot";
import WebhookPRLabelAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/webhook-pr-label-agent.js";
import {isPullRequest} from "./utils/github-utils.js";
import WebhookSummarizePRAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/webhook-summarize-pr.agent.js";
import WebhookSearchCommitsAgent from "./agents/github-webhooks-agents/issues-agents/webhook-search-commits.agent.js";
import {servicesConfig} from "./config/config.js";
import WebhookSavePRAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-save-pr.agent.js";
import WebhookUpdatePRAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-update-pr.agent.js";
import {WebhookSearchPRsAgent} from "./agents/github-webhooks-agents/pull-requests-agents/webhook-search-prs.agent.js";
import WebhookSavePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-save-pr-comment.agent.js";
import WebhookUpdatePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-update-pr-comment.agent.js";
import WebhookDeletePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-delete-pr-comment.agent.js";
import logger from "./logger.js";
import {WebhookSearchCodeAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-code.agent.js";

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
const savePRAgent = new WebhookSavePRAgent();
const updatePRAgent = new WebhookUpdatePRAgent();
const searchPRsAgent = new WebhookSearchPRsAgent()
const savePRCommentAgent = new WebhookSavePRCommentAgent();
const updatePRCommentAgent = new WebhookUpdatePRCommentAgent();
const deletePRCommentAgent = new WebhookDeletePRCommentAgent();
const searchCodeAgent = new WebhookSearchCodeAgent();

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
        if(isPullRequest(context)){
            await savePRCommentAgent.handleEvent(context);
        }else{
            await saveIssueCommentAgent.handleEvent(context);
        }
    });

    app.on(["issue_comment.edited"], async (context: Context<"issue_comment.edited">) => {
        if(isPullRequest(context)){
            await updatePRCommentAgent.handleEvent(context);
        }else{
            await updateIssueCommentAgent.handleEvent(context);
        }
    });

    app.on(["issue_comment.deleted"], async (context: Context<"issue_comment.deleted">) => {
        if(isPullRequest(context)){
            await deletePRCommentAgent.handleEvent(context);
        }else{
            await deleteIssueCommentAgent.handleEvent(context);
        }
    });

    // PRs ---------------------------------------------------------------------

    app.on(["pull_request.opened"], async (context: Context<"pull_request.opened">) => {
        await run(context, prLabelAgent);
        await run(context, summarizePRAgent);
        await savePRAgent.handleEvent(context);
    });

    app.on(["pull_request.edited"], async (context: Context<"pull_request.edited">) => {
        await updatePRAgent.handleEvent(context);
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
            await searchCodeAgent.handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-pull-requests", async(context: Context)=> {
        if(!isPullRequest(context)){
            await searchPRsAgent.handleEvent(context);
        }
    })
}


const run = async (context: Context, agent) => {
    const repo = context.repo();
    try {
        if (!servicesConfig[repo.owner] ||
            !servicesConfig[repo.owner][repo.repo] ||
            !servicesConfig[repo.owner][repo.repo].automatedServices) {
            logger.info(`No configuration found for ${repo.owner}/${repo.repo}`);
            return;
        }

        const repoConfig = servicesConfig[repo.owner][repo.repo];
        if (repoConfig.automatedServices.includes(agent.getService())) {
            await agent.handleEvent(context);
        }
    } catch (error) {
        logger.error(`Error processing event for ${repo.owner}/${repo.repo}:`, error);
        throw error;
    }
}

export default webhooks;