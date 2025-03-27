import { Context } from "probot";
import OpenAI from "openai";
import {LLMAgent} from "../../llm-agent.js";
import gitmate from "../../../api/gitmate-rest.js";
import {getErrorMsg} from "../../../messages/messages.js";
import llmClient from "../../../llm-client.js";
import logger from "../../../logger.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";


export class SimilarIssuesDetectorAgent extends LLMAgent<Context, string> {

    constructor() {
        super();
    }

    async handleEvent(context: Context): Promise<string> {
        try {
            const { owner, repo, issue_number } = context.issue();
            const issue = await context.octokit.issues.get({ owner, repo, issue_number });

            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const similarIssues = await gitmate.issueChunks.search({
                content: issueText,
                limit: 10
            });

            const formattedIssues = this.formatSimilarIssues(similarIssues.data);

            const prompt = this.createPrompt( ISSUE_AGENT_PROMPTS.SEARCH_SIMILAR_ISSUES,{
                issueTitle: issue.data.title,
                issueBody: issue.data.body || "",
                similarIssues: formattedIssues,
            });

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{ role: "user", content: prompt }],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };

            const chatCompletion = await llmClient.chat.completions.create(params);
            const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";

            let responseBody: string;
            try {
                const parsed = JSON.parse(responseText);
                responseBody = parsed.response || "No relevant response generated.";
            } catch (e) {
                logger.warn("LLM response not in expected JSON format, using raw text.");
                responseBody = responseText;
            }

            return responseBody;
        } catch (error) {
            logger.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }

    private formatSimilarIssues(similarIssues: any[]): string {
        if (!similarIssues || similarIssues.length === 0) {
            return "No similar issues were found in the database.";
        }

        return similarIssues
            .map((chunk, index) => {
                const { owner, repo, issue, content } = chunk.properties || {};
                return `**${index + 1}.** **Owner:** ${owner || "Unknown owner"}\n**Repo:** ${repo || "Unknown repo"}\n**Issue ID:** ${issue || "Unknown ID"}\n**Content:** ${content || "No content available"}`;
            })
            .join("\n\n");
    }
}