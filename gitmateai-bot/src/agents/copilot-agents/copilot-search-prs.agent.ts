
import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import {getErrorMsg} from "../../messages/messages.js";
import SearchPRsAgent from "../common/pull-requests-agents/search-prs.agent.js";
import {Agent} from "../../agent.decorator.js";
import {Inject} from "typedi";

@Agent()
export class CopilotSearchPRsAgent extends LLMAgent<CopilotAgentInput, string> {

    @Inject()
    private searchPRsAgent: SearchPRsAgent;

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;

            return await this.searchPRsAgent.handleEvent({
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