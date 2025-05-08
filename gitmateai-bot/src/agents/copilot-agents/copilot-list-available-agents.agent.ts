import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import {availableCopilotAgentsToString} from "./copilot-available-agents.js";
import {Agent} from "../../agent.decorator.js";

@Agent()
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