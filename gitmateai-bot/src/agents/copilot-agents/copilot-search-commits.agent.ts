import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import {getErrorMsg} from "../../messages/messages.js";
import SearchCommitsAgent from "../common/commits-agents/search-commits-agent.js";
import {Inject} from "typedi";
import {Agent} from "../../agent.decorator.js";

@Agent()
export class CopilotSearchCommitsAgent extends LLMAgent<CopilotAgentInput, string> {

    @Inject()
    private searchCommitsAgent: SearchCommitsAgent;

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;

            return await this.searchCommitsAgent.handleEvent({
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