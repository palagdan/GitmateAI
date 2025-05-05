import {LlmAgent} from "../llm-agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../prompts.js";
import LLMQueryAgent from "./llm-query.agent.js";


export class SummarizeIssueAgent extends LlmAgent<string, string> {

    async handleEvent(context: string): Promise<string> {
        const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.SUMMARIZE_ISSUE, {
            context: context
        });
        const llmQueryAgent: LLMQueryAgent = new LLMQueryAgent();
        return await llmQueryAgent.handleEvent(prompt);
    }
}

export default SummarizeIssueAgent;