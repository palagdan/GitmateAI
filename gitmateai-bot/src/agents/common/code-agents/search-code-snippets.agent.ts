import {LLMAgent} from "../../LLMAgent.js";
import gitmateai from "../../../api/gitmateai-rest.js";
import {CODE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";
import {SearchQuery} from "../types.js";

class SearchCodeSnippetsAgent extends LLMAgent<SearchQuery, string> {

    async handleEvent(input: SearchQuery): Promise<string> {
        const {content, limit, fields} = input;
        const llmQueryAgent: LLMQueryAgent = new LLMQueryAgent();
        const preprocessedSearchCodeSnippets = this.createPrompt(CODE_AGENT_PROMPTS.PREPROCESS_SEARCH_CODE_QUERY_PROMPT, {context: content});
        const response = await llmQueryAgent.handleEvent(preprocessedSearchCodeSnippets);
        const parsedResponse = JSON.parse(response);
        const refinedQuery = parsedResponse.refinedQuery;

        const codeSnippets = await gitmateai.codeChunks.search({
            content: refinedQuery,
            limit: limit,
            fields: fields
        });

        const formattedCodeSections = this.formatCodeSections(codeSnippets.data);
        const prompt = this.createPrompt(CODE_AGENT_PROMPTS.SEARCH_CODE_SNIPPETS, {
            context: content,
            codeSections: formattedCodeSections,
        });

        this.agentLogger.info({
            codeSectionsCount: codeSnippets.data?.length || 0
        }, "Search completed successfully");

        return await llmQueryAgent.handleEvent(prompt);
    }

    private formatCodeSections(codeSections: any[]): string {
        if (!codeSections || codeSections.length === 0) {
            return "No similar code sections were found in the database.";
        }

        return codeSections
            .map((chunk, index) => {
                const {owner, repo, filePath, content} = chunk.properties || {};
                return `**${index + 1}.** 
                **Owner:** ${owner || "Unknown owner"}\n
                **Repo:** ${repo || "Unknown repo"}\n
                **FilePath:** ${filePath || "Unknown ID"}\n
                **Content:** ${content || "No content available"}`;
            })
            .join("\n\n");
    }
}

export default SearchCodeSnippetsAgent;