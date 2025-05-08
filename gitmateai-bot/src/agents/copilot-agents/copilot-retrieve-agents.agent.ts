import {LLMAgent} from "../llm-agent.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";
import {availableCopilotAgentsToString} from "./copilot-available-agents.js";
import {Agent} from "../../agent.decorator.js";
import {llmClient} from "../../llm-client.js";

@Agent()
class CopilotRetrieveAgentsAgent extends LLMAgent<string, any> {

    async handleEvent(input: string): Promise<any> {
        try {
            const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.RETRIEVE_AGENTS, {
                availableAgents: availableCopilotAgentsToString(),
                userInput: input
            });

            const response = await llmClient.generateCompletion(prompt);
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