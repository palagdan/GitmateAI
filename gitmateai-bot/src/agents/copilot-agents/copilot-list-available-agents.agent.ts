import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import {Agent} from "../../agent.decorator.js";
import {
    availableHelpersToString
} from "./copilot-available-agents.js";

@Agent()
class CopilotListAvailableAgentsAgent extends LLMAgent<CopilotAgentInput, any> {
    async handleEvent(input: CopilotAgentInput): Promise<any> {
        try {
           return `## Here's what I can do for you 🌟` + "\n\n" +
                `${availableHelpersToString()}`.trim();
        } catch (error) {

        }
    }
}

export default CopilotListAvailableAgentsAgent;