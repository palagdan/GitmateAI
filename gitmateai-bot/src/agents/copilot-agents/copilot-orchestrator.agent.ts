
import {Octokit} from "octokit";
import { createErrorsEvent, createTextEvent} from "@copilot-extensions/preview-sdk";
import CopilotRetrieveAgentsAgent from "./copilot-retrieve-agents.agent.js";
import CopilotAgentsFactory from "./copilot-agents-factory.js";
import logger from "../../logger.js";
import {CopilotOrchestratorAgentInput} from "./types.js";
import {availableCopilotAgentsToString} from "./copilot-available-agents.js";
import {LLMAgent} from "../llm-agent.js";
import LLMQueryAgent from "../common/llm-query.agent.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";



class CopilotOrchestratorAgent extends LLMAgent<CopilotOrchestratorAgentInput, void> {

    async handleEvent(input: CopilotOrchestratorAgentInput): Promise<void> {
        const {req, res} = input;
        try {

            const tokenForUser = req.get("X-GitHub-Token");

            const octokit = new Octokit({auth: tokenForUser});
            const copilotMessages = req.body.messages;

            const retrieveAgentsAgent = new CopilotRetrieveAgentsAgent();
            const content = copilotMessages[copilotMessages.length - 1].content;

            const messages = [{
                role: "user",
                content: content
            }]

            const retrievedAgents = await retrieveAgentsAgent.handleEvent(content);

            if(retrievedAgents.length == 0) {
                res.write(createTextEvent("### Oops! 😔 I couldn’t find any agents matching your request.\n\n"));
                res.write(createTextEvent(`Available agents are:\n\n${availableCopilotAgentsToString()}`));
                return;
            }

            res.write(createTextEvent(`### 🔍 Found ${retrievedAgents.length} matching agent${retrievedAgents.length !== 1 ? 's' : ''}\n\n` +
                retrievedAgents.map(agent => `- ${agent.name}`).join('\n\n') + '\n\n'));


            const agents = CopilotAgentsFactory.createAgents(retrievedAgents);
            for (const {agent, params} of agents) {
                const response = await agent.handleEvent({
                    content: content,
                    octokit: octokit,
                    copilot_references: copilotMessages[copilotMessages.length - 1].copilot_references,
                    params: params
                });

                messages.push({
                    role: "agent",
                    content: response
                })

            }

            const llmQueryAgent = new LLMQueryAgent();

            const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.ORCHESTRATOR, {
                userQuery: content,
                agentsReports: messages.filter(m => m.role === "agent").map(m => m.content).join("\n\n"),
            });

            const response = await llmQueryAgent.handleEvent(prompt);

            res.write(createTextEvent(response))
        } catch (error) {
            logger.error(error)
            res.write(
                createErrorsEvent([
                    {
                        type: "agent",
                        message: error instanceof Error ? error.message : "Unknown error",
                        code: "PROCESSING_ERROR",
                        identifier: "processing_error",
                    },
                ])
            );
        }
    }
}

export default CopilotOrchestratorAgent;