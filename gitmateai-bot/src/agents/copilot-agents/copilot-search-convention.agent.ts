import {CopilotAgentInput} from "./types.js";
import SearchConventionAgent from "../common/conventions-agents/search-convention.agent.js";
import {getErrorMsg} from "../../messages/messages.js";
import {LLMAgent} from "../llm-agent.js";
import {Inject} from "typedi";
import {Agent} from "../../agent.decorator.js";

@Agent()
class CopilotSearchConventionAgent extends LLMAgent<CopilotAgentInput, string> {

    @Inject()
    private searchConventionAgent: SearchConventionAgent;

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;

            return await this.searchConventionAgent.handleEvent({
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