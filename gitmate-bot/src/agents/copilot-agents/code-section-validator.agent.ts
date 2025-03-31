import {BaseAgent} from "../base.agent.js";
import {CopilotAgentInput} from "./types.js";


class CodeSectionValidatorAgent implements BaseAgent<CopilotAgentInput, void> {


    async handleEvent(codeSection: CopilotAgentInput): Promise<void> {

    }
}

export default CodeSectionValidatorAgent;