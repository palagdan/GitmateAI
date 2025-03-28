import {BaseAgent} from "../base.agent.js";
import {CopilotAgentInput} from "./types.js";


class RulesSearcherAgent implements BaseAgent<CopilotAgentInput, void> {
    async handleEvent(input: CopilotAgentInput): Promise<void> {

    }
}

export default RulesSearcherAgent