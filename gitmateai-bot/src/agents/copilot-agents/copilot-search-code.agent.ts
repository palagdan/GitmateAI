import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import SearchCodeAgent from "../common/code-agents/search-code.agent.js";
import {getErrorMsg} from "../../messages/messages.js";
import {Agent} from "../../agent.decorator.js";
import {Inject} from "typedi";

@Agent()
class CopilotSearchCodeAgent extends LLMAgent<CopilotAgentInput, string> {

    @Inject()
    private searchCodeAgent: SearchCodeAgent;

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const {content} = input;

            return  await this.searchCodeAgent.handleEvent({
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