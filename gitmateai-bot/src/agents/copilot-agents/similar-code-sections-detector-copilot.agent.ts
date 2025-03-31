import {LlmAgent} from "../llm.agent.js";
import {CopilotAgentInput} from "./types.js";


export class SimilarCodeSectionsCopilotAgent extends LlmAgent<CopilotAgentInput, void> {



    async handleEvent(context: CopilotAgentInput): Promise<void> {

    }
}