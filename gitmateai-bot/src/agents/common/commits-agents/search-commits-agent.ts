import {LLMAgent} from "../../llm-agent.js";
import {SearchQuery} from "../types.js";
import { COMMIT_AGENT_PROMPTS} from "../../../prompts.js";
import gitmateai from "../../../api/gitmateai-rest.js";
import {Agent} from "../../../agent.decorator.js";
import {llmClient} from "../../../llm-client.js";

@Agent()
class SearchCommitsAgent extends LLMAgent<SearchQuery, string> {

    async handleEvent(input: SearchQuery) : Promise<string> {
        const {content, limit, fields} = input;
        const preprocessSearchCommitsPrompt = this.createPrompt(COMMIT_AGENT_PROMPTS.PREPROCESS_SEARCH_COMMIT_QUERY_PROMPT, {context: content});
        const response = await llmClient.generateCompletion(preprocessSearchCommitsPrompt);
        const parsedResponse = JSON.parse(response);
        const refinedQuery = parsedResponse.refinedQuery;

        const commits = await gitmateai.commitChunks.search({
            content: refinedQuery,
            limit: 50,
            fields: fields
        });

        const formattedCommits = this.formatSimilarCommits(commits.data);

        const prompt = this.createPrompt(COMMIT_AGENT_PROMPTS.SEARCH_COMMITS, {
            context: content,
            foundCommits: formattedCommits,
        });

        this.agentLogger.info({
            commitsChunksCount: commits.data?.length || 0
        }, "Search completed successfully");

        return await llmClient.generateCompletion(prompt);
    }

    private formatSimilarCommits(similarCommits: any[]) {
        if (!similarCommits || similarCommits.length === 0) {
            return "No similar commits were found in the database.";
        }

        return similarCommits
            .map((chunk, index) => {
                const properties = chunk.properties || {};
                return `**${index + 1}.** 
                **Owner:** ${properties.owner || "Unknown owner"}\n
                **Repo:** ${properties.repo || "Unknown repo"}\n
                **Sha:** ${properties.sha || "Unknown sha"}\n
                **author**: ${properties.author || "Unknown author"}\n
                **commitMessage**: ${properties.commitMessage || "Unknown commit message"}\n
                **fileName**: ${properties.fileName || "Unknown file names"}\n
                **Content:** ${properties.content || "No content available"}\n
                `;
            })
            .join("\n\n");
    }
}

export default SearchCommitsAgent;
