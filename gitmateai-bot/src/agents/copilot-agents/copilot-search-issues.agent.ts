import {LLMAgent} from "../llm-agent.js";
import {CopilotAgentInput} from "./types.js";
import SearchIssuesAgent from "../common/issues-agents/search-issues.agent.js";
import {getErrorMsg} from "../../messages/messages.js";
import {Inject} from "typedi";
import {Agent} from "../../agent.decorator.js";

@Agent()
export class CopilotSearchIssuesAgent extends LLMAgent<CopilotAgentInput, string> {

    @Inject()
    private searchIssuesAgent: SearchIssuesAgent;

    async handleEvent(input: CopilotAgentInput): Promise<string> {
        try{
            const { content } = input;

            return await this.searchIssuesAgent.handleEvent({
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