import {Probot} from "probot";
import {IssueLabelAgent} from "./agents/github-agents/issues-agents/issue-label-agent.js";
import OpenAI from "openai";
import command from "./commands/command.js";
import {isPullRequest} from "./utils/github-utils.js";
import {HelpAgent} from "./agents/github-agents/help-agent.js";
import {SummarizeIssueAgent} from "./agents/github-agents/issues-agents/summarize-issue-agent.js";
import {OctokitGitHubService} from "./services/github-service.js";
import {SimilarIssuesDetectorAgent} from "./agents/github-agents/issues-agents/similar-issues-detector-agent.js";
import {DeleteIssueAgent} from "./agents/github-agents/issues-agents/delete-issue-agent.js";
import {SaveIssueAgent} from "./agents/github-agents/issues-agents/save-issue-agent.js";


import dotenv from "dotenv";
import {helpMessage} from "./config/config.js";
import CreateIssueCommentAgent from "./agents/github-agents/issues-agents/create-issue-comment-agent.js";
dotenv.config()


const llmClient = new OpenAI({apiKey: process.env.LLM_API_KEY});
const githubService = new OctokitGitHubService();
const issueLabelAgent = new IssueLabelAgent(llmClient, githubService);
const helpAgent = new HelpAgent();
const summarizeIssueAgent = new SummarizeIssueAgent(llmClient, githubService);
const similarIssuesAgent = new SimilarIssuesDetectorAgent(llmClient);
const deleteIssueAgent = new DeleteIssueAgent();
const saveIssueAgent = new SaveIssueAgent();

const createIssueCommentAgent = new CreateIssueCommentAgent();

export default (app: Probot) => {

    app.on(["issues.opened", "issues.edited"], async (context) => {
        const labelAgentResponse = await issueLabelAgent.handleEvent(context);
        const similarIssueAgentResponse = await similarIssuesAgent.handleEvent(context);
        const saveIssueAgentResponse = await saveIssueAgent.handleEvent(context);
        await createIssueCommentAgent.handleEvent({
            context: context,
            values: [labelAgentResponse, similarIssueAgentResponse, saveIssueAgentResponse]
        })
    });

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


    app.on("issues.deleted", async (context) => {
        await deleteIssueAgent.handleEvent(context);
    })


};
