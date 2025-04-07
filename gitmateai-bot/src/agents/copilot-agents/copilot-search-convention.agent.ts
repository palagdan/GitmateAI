import {CopilotAgentInput} from "./types.js";
import SearchConventionAgent from "../common/conventions-agents/search-convention.agent.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";
import {LLMAgent} from "../LLMAgent.js";

class CopilotSearchConventionAgent extends LLMAgent<CopilotAgentInput, void> {

    async handleEvent(input: CopilotAgentInput): Promise<void> {
        try{
            const { content } = input;
            const searchConventionAgent = new SearchConventionAgent();
            const response = await searchConventionAgent.handleEvent({
                content: content,
                limit: 20
            });
            input.writeFunc(createTextEvent(response + '\n'));
        }catch(error){
            this.agentLogger.error(error)
            input.writeFunc(createTextEvent(getErrorMsg(this.constructor.name, error)))
        }
    }
}

export default  CopilotSearchConventionAgent;