import {LLMAgent} from "../../LLMAgent.js";
import gitmateai from "../../../api/gitmateai-rest.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";
import {SearchQuery} from "../types.js";

class SearchIssuesAgent extends LLMAgent<SearchQuery, string> {

    async handleEvent(input: SearchQuery): Promise<string> {
        const {content, limit, fields} = input;
        const preprocessSearchIssuePrompt = this.createPrompt(ISSUE_AGENT_PROMPTS.PREPROCESS_SEARCH_ISSUES_QUERY_PROMPT, {context: content});
        const llmQueryAgent = new LLMQueryAgent();
        const response = await llmQueryAgent.handleEvent(preprocessSearchIssuePrompt);
        const parsedResponse = JSON.parse(response);
        const refinedQuery = parsedResponse.refinedQuery;

        const issues = await gitmateai.issueChunks.search({
            content: refinedQuery,
            limit: limit,
            fields: fields
        });

        const formattedIssues = this.formatSimilarIssues(issues.data);

        const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.SEARCH_ISSUES, {
            context: content,
            foundIssues: formattedIssues,
        });

        this.agentLogger.info({
            issuesChunksCount: issues.data?.length || 0
        }, "Search completed successfully");


        return await llmQueryAgent.handleEvent(prompt);
    }

    private formatSimilarIssues(similarIssues: any[]): string {
        if (!similarIssues || similarIssues.length === 0) {
            return "No issues were found in the database.";
        }

        return similarIssues
            .map((chunk, index) => {
                const properties = chunk.properties || {};
                return `**${index + 1}.** 
                **Owner:** ${properties.owner || "Unknown owner"}\n
                **Repo:** ${properties.repo || "Unknown repo"}\n
                **Issue Number:** ${properties.issueNumber || "Unknown ID"}\n
                **author**: ${properties.author || "Unknown author"}\n
                **Type:** ${properties.type || "Unknown type"}\n
                **Content:** ${properties.content || "No content available"}\n
                `;
            })
            .join("\n\n");
    }
}

export default SearchIssuesAgent;