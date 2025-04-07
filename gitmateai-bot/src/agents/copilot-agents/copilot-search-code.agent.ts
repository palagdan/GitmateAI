import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import SearchCodeSnippetsAgent from "../common/code-agents/search-code-snippets.agent.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";

class CopilotSearchCodeAgent extends LLMAgent<CopilotAgentInput, void> {

    async handleEvent(input: CopilotAgentInput): Promise<void> {
        try{
            const {content} = input;
            const codeSnippetsAgent: SearchCodeSnippetsAgent = new SearchCodeSnippetsAgent();
            const response =   await codeSnippetsAgent.handleEvent({
                content: content,
                limit: 20
            })
            input.writeFunc(createTextEvent(response + '\n'));
        }catch(error){
            this.agentLogger.error(error);
            input.writeFunc(createTextEvent(getErrorMsg(this.constructor.name, error)));
        }
    }
}

export default CopilotSearchCodeAgent;