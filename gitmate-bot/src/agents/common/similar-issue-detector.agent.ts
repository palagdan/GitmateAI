import {LlmAgent} from "../llm.agent.js";
import gitmate from "../../api/gitmate-rest.js";
import {ISSUE_AGENT_PROMPTS} from "../../prompts.js";
import OpenAI from "openai";
import llmClient from "../../llm-client.js";
import logger from "../../logger.js";
import {getErrorMsg} from "../../messages/messages.js";


class SimilarIssuesDetectorAgent extends LlmAgent<string, string> {

    async handleEvent(context: string): Promise<string> {
        try {
            const similarIssues = await gitmate.issueChunks.search({
                content: context,
                limit: 10
            });

            const formattedIssues = this.formatSimilarIssues(similarIssues.data);

            const prompt = this.createPrompt( ISSUE_AGENT_PROMPTS.SEARCH_SIMILAR_ISSUES,{
                context: context,
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

export default SimilarIssuesDetectorAgent;