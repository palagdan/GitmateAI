import {LLMAgent} from "../../LLMAgent.js";
import {CONVENTION_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";



class GenerateCodeConventionAgent extends LLMAgent<string, string> {

    async handleEvent(content: string): Promise<string> {
        const prompt = this.createPrompt(CONVENTION_AGENT_PROMPTS.RETRIEVE_CODE_CONVENTIONS, {
            content: content
        });
        const llmQueryAgent: LLMQueryAgent = new LLMQueryAgent();
        return await llmQueryAgent.handleEvent(prompt);
    }
}

export default GenerateCodeConventionAgent;