import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import SearchCodeSnippetsAgent from "../common/code-agents/search-code-snippets.agent.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";

class CopilotSearchCodeAgent extends LLMAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const {content} = input;
            const codeSnippetsAgent: SearchCodeSnippetsAgent = new SearchCodeSnippetsAgent();
            return  await codeSnippetsAgent.handleEvent({
                content: content,
                limit: 20
            })

        }catch(error){
            this.agentLogger.error(error);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default CopilotSearchCodeAgent;