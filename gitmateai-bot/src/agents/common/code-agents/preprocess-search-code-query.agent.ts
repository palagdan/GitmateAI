import {LLMAgent} from "../../llm-agent.js";
import {CODE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";


class PreprocessSearchCodeQueryAgent extends LLMAgent<string, string>{

    async handleEvent(query: string): Promise<string> {
        const prompt = this.createPrompt(CODE_AGENT_PROMPTS.PREPROCESS_SEARCH_CODE_QUERY_PROMPT, {query: query});
        const llmQueryAgent = new LLMQueryAgent();
        const response = await llmQueryAgent.handleEvent(prompt);
        const parsedResponse = JSON.parse(response);
        return parsedResponse.refinedQuery;
    }
}

export default PreprocessSearchCodeQueryAgent;