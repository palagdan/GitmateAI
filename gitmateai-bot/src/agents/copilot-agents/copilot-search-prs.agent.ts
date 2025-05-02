
import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import {getErrorMsg} from "../../messages/messages.js";
import SearchPRsAgent from "../common/pull-requests-agents/search-prs.agent.js";

export class CopilotSearchPRsAgent extends LLMAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;
            const searchPRsAgent = new SearchPRsAgent();
            return await searchPRsAgent.handleEvent({
                content: content,
                limit: 20
            })
        }catch(error){
            this.agentLogger.error(error);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default CopilotSearchPRsAgent;