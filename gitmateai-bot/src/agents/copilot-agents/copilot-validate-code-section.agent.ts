import {BaseAgent} from "../base.agent.js";
import {CopilotAgentInput} from "./types.js";


class CopilotValidateCodeSectionAgent implements BaseAgent<CopilotAgentInput, void> {


    async handleEvent(codeSection: CopilotAgentInput): Promise<void> {
        const {content, octokit, copilot_references} = codeSection;

        // retrieve questions for vector database search based on code and user content

        // search convention in vector database
        // find conventions in vector database
        // ask LLM to validate code against conventions

    }
}

export default CopilotValidateCodeSectionAgent;