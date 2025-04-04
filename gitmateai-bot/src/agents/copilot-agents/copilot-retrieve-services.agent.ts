import {LLMAgent} from "../LLMAgent.js";
import logger from "../../logger.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";
import {availableCopilotServicesToString} from "./copilot-available-services.js";
import LLMQueryAgent from "../common/llm-query.agent.js";


class CopilotRetrieveServicesAgent extends LLMAgent<string, string[]> {

    private agentLogger = logger.child({ agent: this.constructor.name});

    async handleEvent(input: string): Promise<string[]> {
        try {
            const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.RETRIEVE_SERVICES, {
                availableServices: availableCopilotServicesToString(),
                userInput: input
            });
            const llmQueryAgent = new LLMQueryAgent();
            const response = await llmQueryAgent.handleEvent(prompt);
            const result = JSON.parse(response);
            this.agentLogger.info(`Matched ${result.services.length} service(s)`);
            return result.services;
        } catch (error) {
            this.agentLogger.error(error);
            return [];
        }
    }
}

export default CopilotRetrieveServicesAgent;