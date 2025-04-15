import {CopilotAgentInput} from "./types.js";
import SearchConventionAgent from "../common/conventions-agents/search-convention.agent.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";
import {LLMAgent} from "../LLMAgent.js";

class CopilotSearchConventionAgent extends LLMAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;
            const searchConventionAgent = new SearchConventionAgent();
            return await searchConventionAgent.handleEvent({
                content: content,
                limit: 20
            });
        }catch(error){
            this.agentLogger.error(error)
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default  CopilotSearchConventionAgent;