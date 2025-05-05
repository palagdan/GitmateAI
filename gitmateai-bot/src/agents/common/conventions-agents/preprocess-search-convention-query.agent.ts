import {LlmAgent} from "../../llm-agent.js";
import {CONVENTION_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";


class PreprocessSearchConventionQueryAgent extends LlmAgent<string, string>{

    async handleEvent(input: string ): Promise<string> {
        const prompt = this.createPrompt(CONVENTION_AGENT_PROMPTS.PREPROCESS_SEARCH_CONVENTION_QUERY_PROMPT, {
            userQuery: input
        })
        const llmQueryAgent = new LLMQueryAgent();
        const response = await llmQueryAgent.handleEvent(prompt);
        const parsedResponse = JSON.parse(response);
        return parsedResponse.refinedQuery;
    }
}

export default PreprocessSearchConventionQueryAgent;