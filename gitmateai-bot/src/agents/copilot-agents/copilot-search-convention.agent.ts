import {BaseAgent} from "../base.agent.js";
import {CopilotAgentInput} from "./types.js";
import SearchConventionAgent from "../common/conventions-agents/search-convention.agent.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";
import logger from "../../logger.js";

class CopilotSearchConventionAgent implements BaseAgent<CopilotAgentInput, void> {

    private agentLogger = logger.child({ agent: this.constructor.name});

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