import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import SearchCodeAgent from "../common/code-agents/search-code.agent.js";
import {getErrorMsg} from "../../messages/messages.js";

class CopilotSearchCodeAgent extends LLMAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const {content} = input;
            const codeSnippetsAgent: SearchCodeAgent = new SearchCodeAgent();
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