import {LLMAgent} from "../../llm-agent.js";
import gitmateai from "../../../api/gitmateai-rest.js";
import {CONVENTION_AGENT_PROMPTS} from "../../../prompts.js";
import {SearchQuery} from "../types.js";

class SearchConventionAgent extends LLMAgent<SearchQuery, string>{

    async handleEvent(input: SearchQuery): Promise<string> {
        const {content, limit, fields} = input;


        const preprocessedSearchConvention = this.createPrompt(CONVENTION_AGENT_PROMPTS.PREPROCESS_SEARCH_CONVENTION_QUERY_PROMPT, {
            userQuery: content
        })
        const response = await this.generateCompletion(preprocessedSearchConvention);
        const parsedResponse = JSON.parse(response);
        const refinedQuery = parsedResponse.refinedQuery;

        const conventions = await gitmateai.conventionChunks.search({
            content: refinedQuery,
            limit: input.limit,
            fields: input.fields
        });

        const formattedConventions = this.formatConventions(conventions.data);

        const prompt = this.createPrompt(CONVENTION_AGENT_PROMPTS.SEARCH_CONVENTIONS, {
            context: content,
            foundConventions: formattedConventions,
        });

        this.agentLogger.info({
            codeSectionsCount: conventions.data?.length || 0
        }, "Search completed successfully");

        return await this.generateCompletion(prompt);
    }

    private formatConventions(conventions: any[]): string {
         return conventions
             .map((chunk, index) => {
                 const {content, source} = chunk.properties || {};
                 return `**${index + 1}.**Content:** ${content || "No content available"}\n**Source:** ${source || "No source available"}`;
             })
             .join("\n\n");
    }

}

export default SearchConventionAgent;

