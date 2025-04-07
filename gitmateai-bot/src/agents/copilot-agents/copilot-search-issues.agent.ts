import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import SearchIssuesAgent from "../common/issues-agents/search-issues.agent.js";
import {getErrorMsg} from "../../messages/messages.js";

export class CopilotSearchIssuesAgent extends LLMAgent<CopilotAgentInput, void> {

    async handleEvent(input: CopilotAgentInput): Promise<void> {
        try{
            const { content } = input;
            const searchIssuesAgent = new SearchIssuesAgent();
            const response = await searchIssuesAgent.handleEvent({
                content: content,
                limit: 20
            });
            input.writeFunc(createTextEvent(response + '\n'));
        }catch(error){
            this.agentLogger.error(error);
            input.writeFunc(createTextEvent(getErrorMsg(this.constructor.name, error)));
        }
    }
}

export default CopilotSearchIssuesAgent;