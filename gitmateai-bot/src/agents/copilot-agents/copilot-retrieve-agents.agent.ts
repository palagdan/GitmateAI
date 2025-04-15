import {LLMAgent} from "../LLMAgent.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";
import {availableCopilotAgentsToString} from "./copilot-available-agents.js";
import LLMQueryAgent from "../common/llm-query.agent.js";


class CopilotRetrieveAgentsAgent extends LLMAgent<string, any> {

    async handleEvent(input: string): Promise<any> {
        try {
            const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.RETRIEVE_AGENTS, {
                availableAgents: availableCopilotAgentsToString(),
                userInput: input
            });
            const llmQueryAgent = new LLMQueryAgent();
            const response = await llmQueryAgent.handleEvent(prompt);
            const result = JSON.parse(response);
            this.agentLogger.info(`Matched ${result.agents.length} agent(s)`);
            return result.agents;
        } catch (error) {
            this.agentLogger.error(error);
            return [];
        }
    }
}

export default CopilotRetrieveAgentsAgent;