import {LlmAgent} from "../../llm-agent.js";
import {ISSUE_AGENT_PROMPTS} from "../../../prompts.js";
import LLMQueryAgent from "../llm-query.agent.js";


interface LabelContext {
    issueInformation: string,
    availableLabels: string[],
}

export class IssueLabelAgent extends LlmAgent<LabelContext, string[]> {

    async handleEvent(context: LabelContext): Promise<string[]> {
        const prompt = this.createPrompt(ISSUE_AGENT_PROMPTS.LABEL_ISSUE, {
            context: context.issueInformation,
            availableLabels: context.availableLabels.join(", ")
        });

        const llmQueryAgent: LLMQueryAgent = new LLMQueryAgent();
        const labels = await llmQueryAgent.handleEvent(prompt);
        const parsedLabels = JSON.parse(labels);
        return parsedLabels.labels;
    }

}

export default IssueLabelAgent;
