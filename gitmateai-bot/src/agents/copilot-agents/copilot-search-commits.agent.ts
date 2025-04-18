import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import {getErrorMsg} from "../../messages/messages.js";
import SearchCommitsAgent from "../common/commits-agents/search-commits-agent.js";


export class CopilotSearchCommitsAgent extends LLMAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;
            const searchCommitsAgent = new SearchCommitsAgent();
            return await searchCommitsAgent.handleEvent({
                content: content,
                limit: 20
            });
        }catch(error){
            this.agentLogger.error(error);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default CopilotSearchCommitsAgent;