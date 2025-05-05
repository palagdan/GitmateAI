import {LlmAgent} from "../../llm-agent.js";
import {CODE_AGENT_PROMPTS, CONVENTION_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";


interface CodeSectionValidatorAgentInput {
    content: string;
    conventions: string;
}

class ValidateCodeSectionAgent extends LlmAgent<CodeSectionValidatorAgentInput, string> {

    async handleEvent(input: CodeSectionValidatorAgentInput): Promise<string> {
        const { content, conventions } = input;
        const prompt = this.createPrompt(CODE_AGENT_PROMPTS.VALIDATE_CODE_SECTION_AGAINST_CONVENTIONS, {
            code: content,
            conventions: conventions
        });
        const llmQueryAgent: LLMQueryAgent = new LLMQueryAgent();
        return await llmQueryAgent.handleEvent(prompt);
    }

}