import {LlmAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import SearchIssuesAgent from "../common/issues-agents/search-issues.agent.js";
import {getErrorMsg} from "../../messages/messages.js";

export class CopilotSearchIssuesAgent extends LlmAgent<CopilotAgentInput, string> {

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;
            const searchIssuesAgent = new SearchIssuesAgent();
            return await searchIssuesAgent.handleEvent({
                content: content,
                limit: 20
            })
        }catch(error){
            this.agentLogger.error(error);
            return getErrorMsg(this.constructor.name, error);
        }
    }
}

export default CopilotSearchIssuesAgent;