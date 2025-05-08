import {LLMAgent} from "../../llm-agent.js";
import {SearchQuery} from "../types.js";
import gitmateai from "../../../api/gitmateai-rest.js";
import {PR_AGENT_PROMPTS} from "../../../prompts.js";
import {Agent} from "../../../agent.decorator.js";
import {llmClient} from "../../../llm-client.js";

@Agent()
class SearchPRsAgent extends LLMAgent<SearchQuery, string> {

    async handleEvent(input: SearchQuery): Promise<string> {
        const {content, limit, fields} = input;
        const preprocessSearchIssuePrompt = this.createPrompt(PR_AGENT_PROMPTS.PREPROCESS_SEARCH_PRs_QUERY_PROMPT, {context: content});

        const response = await llmClient.generateCompletion(preprocessSearchIssuePrompt);
        const parsedResponse = JSON.parse(response);
        const refinedQuery = parsedResponse.refinedQuery;

        const pullRequests = await gitmateai.issueChunks.search({
            content: refinedQuery,
            limit: limit,
            fields: fields
        });

        const formattedIssues = this.formatSimilarPRs(pullRequests.data);

        const prompt = this.createPrompt(PR_AGENT_PROMPTS.SEARCH_PRs, {
            context: content,
            foundPRs: formattedIssues,
        });

        this.agentLogger.info({
            issuesChunksCount: pullRequests.data?.length || 0
        }, "Search completed successfully");


        return await llmClient.generateCompletion(prompt);
    }

    private formatSimilarPRs(similarPRs: any[]): string {
        if (!similarPRs || similarPRs.length === 0) {
            return "No similar PRs were found in the database.";
        }

        return similarPRs
            .map((chunk, index) => {
                const properties = chunk.properties || {};
                return `**${index + 1}.** 
                **Owner:** ${properties.owner || "Unknown owner"}\n
                **Repo:** ${properties.repo || "Unknown repo"}\n
                **PR Number:** ${properties.issueNumber || "Unknown ID"}\n
                **author**: ${properties.author || "Unknown author"}\n
                **Type:** ${properties.type || "Unknown type"}\n
                **Content:** ${properties.content || "No content available"}\n
                `;
            })
            .join("\n\n");
    }
}

export default SearchPRsAgent;