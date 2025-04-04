
import {LLMAgent} from "../../LLMAgent.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";


class PreprocessSearchIssuesQueryAgent extends LLMAgent<string, string>{

    async handleEvent(input: string ): Promise<string> {
        const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.PREPROCESS_SEARCH_ISSUES_QUERY_PROMPT, {
            userQuery: input
        })
        const llmQueryAgent = new LLMQueryAgent();
        const response = await llmQueryAgent.handleEvent(prompt);
        const parsedResponse = JSON.parse(response);
        return parsedResponse.refinedQuery;
    }
}

export default PreprocessSearchIssuesQueryAgent;