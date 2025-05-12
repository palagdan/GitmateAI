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
import {githubConfig} from "./config/config.js";
import WebhookSavePRAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-save-pr.agent.js";
import WebhookUpdatePRAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-update-pr.agent.js";
import {WebhookSearchPRsAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-prs.agent.js";
import WebhookSavePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-save-pr-comment.agent.js";
import WebhookUpdatePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-update-pr-comment.agent.js";
import WebhookDeletePRCommentAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/crud-agents/webhook-delete-pr-comment.agent.js";
import logger from "./logger.js";
import {WebhookSearchCodeAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-search-code.agent.js";
import {Container} from "typedi";
import WebhookSummarizePrAgent
    from "./agents/github-webhooks-agents/pull-requests-agents/webhook-summarize-pr.agent.js";
import {WebhookIssueHelpAgent} from "./agents/github-webhooks-agents/issues-agents/webhook-issue-help.agent.js";


const webhooks = (app) => {

    // Issues ---------------------------------------------------------------------
    app.on(["issues.opened"], async (context: Context<"issues.opened">) => {
        await run(context, Container.get(WebhookIssueLabelAgent));
        await run(context, Container.get(WebhookSummarizeIssueAgent));
        await run(context, Container.get(WebhookSearchIssuesAgent));
        await run(context, Container.get(WebhookSearchCodeAgent));
        await run(context, Container.get(WebhookSearchCommitsAgent));
        await run(context, Container.get(WebhookSearchPRsAgent));

        await Container.get(WebhookSaveIssueAgent).handleEvent(context);
    });

    app.on(["issues.edited"], async (context: Context<"issues.edited">) => {
        await Container.get(WebhookUpdateIssueAgent).handleEvent(context);
    });

    app.on(["issues.deleted"], async (context: Context<"issues.deleted">) => {
        await Container.get(WebhookDeleteIssueAgent).handleEvent(context);
    })

    app.on(["issue_comment.created", ], async (context: Context<"issue_comment.created">) => {
        if(isPullRequest(context)){
            await Container.get(WebhookSavePRCommentAgent).handleEvent(context);
        }else{
            await Container.get(WebhookSaveIssueCommentAgent).handleEvent(context);
        }
    });

    app.on(["issue_comment.edited"], async (context: Context<"issue_comment.edited">) => {
        if(isPullRequest(context)){
            await Container.get(WebhookUpdatePRCommentAgent).handleEvent(context);
        }else{
            await Container.get(WebhookUpdateIssueCommentAgent).handleEvent(context);
        }
    });

    app.on(["issue_comment.deleted"], async (context: Context<"issue_comment.deleted">) => {
        if(isPullRequest(context)){
            await Container.get(WebhookDeletePRCommentAgent).handleEvent(context);
        }else{
            await Container.get(WebhookDeleteIssueCommentAgent).handleEvent(context);
        }
    });

    // PRs ---------------------------------------------------------------------

    app.on(["pull_request.opened"], async (context: Context<"pull_request.opened">) => {

        await run(context, Container.get(WebhookPRLabelAgent));
        await run(context, Container.get(WebhookSummarizePrAgent));
        await Container.get(WebhookSavePRAgent).handleEvent(context);
    });

    app.on(["pull_request.edited"], async (context: Context<"pull_request.edited">) => {
        await Container.get(WebhookUpdatePRAgent).handleEvent(context);
    });

    // commands ---------------------------------------------------------------------

    command(app, ["issue_comment.created", "issue_comment.edited"], "label", async (context: Context) => {
        if(isPullRequest(context)){
            await Container.get(WebhookPRLabelAgent).handleEvent(context);
        }else{
            await Container.get(WebhookIssueLabelAgent).handleEvent(context);
        }
    });

    command(app, ["issue_comment.created", "issue_comment.edited"], "summarize", async (context: Context) => {
        if(isPullRequest(context)) {
            await Container.get(WebhookSummarizePRAgent).handleEvent(context);
        }else{
            await Container.get(WebhookSummarizeIssueAgent).handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-issues", async (context: Context) => {
        if(!isPullRequest(context)){
            await Container.get(WebhookSearchIssuesAgent).handleEvent(context);
        }
    });

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-commits", async(context: Context)=> {
        if(!isPullRequest(context)){
            await Container.get(WebhookSearchCommitsAgent).handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-code", async(context: Context)=> {
        if(!isPullRequest(context)){
            await Container.get(WebhookSearchCodeAgent).handleEvent(context);
        }
    })

    command(app, ["issue_comment.created", "issue_comment.edited"], "find-similar-pull-requests", async(context: Context)=> {
        if(!isPullRequest(context)){
            await Container.get(WebhookSearchPRsAgent).handleEvent(context);
        }
    })


    command(app, ["issue_comment.created", "issue_comment.edited"], "help", async(context: Context)=> {
        await Container.get(WebhookIssueHelpAgent).handleEvent(context);
    })


}


const run = async (context: Context, agent) => {
    const repo = context.repo();
    try {
        if (!githubConfig[repo.owner] ||
            !githubConfig[repo.owner][repo.repo] ||
            !githubConfig[repo.owner][repo.repo].automatedServices) {
            logger.info(`No configuration found for ${repo.owner}/${repo.repo}`);
            return;
        }

        const repoConfig = githubConfig[repo.owner][repo.repo];
        if (repoConfig.automatedServices.includes(agent.getService())) {
            await agent.handleEvent(context);
        }
    } catch (error) {
        logger.error(`Error processing event for ${repo.owner}/${repo.repo}:`, error);
        throw error;
    }
}

export default webhooks;