import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import {availableCopilotAgentsToString} from "./copilot-available-agents.js";

class CopilotListAvailableAgentsAgent extends LLMAgent<CopilotAgentInput, any> {
    async handleEvent(input: CopilotAgentInput): Promise<any> {
        try {
            return `## CopilotListAvailableServicesAgent Report 🤖` + "\n\n" +
            `### Here are the available services:` + "\n\n" +
            `${availableCopilotAgentsToString()}`.trim()
            ;
        } catch (error) {

        }
    }
}

export default CopilotListAvailableAgentsAgent;