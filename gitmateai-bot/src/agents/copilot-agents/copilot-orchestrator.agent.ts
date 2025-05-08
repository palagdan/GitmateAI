
import {Octokit} from "octokit";
import { createErrorsEvent, createTextEvent} from "@copilot-extensions/preview-sdk";
import CopilotRetrieveAgentsAgent from "./copilot-retrieve-agents.agent.js";
import CopilotAgentsFactory from "./copilot-agents-factory.js";
import logger from "../../logger.js";
import {CopilotOrchestratorAgentInput} from "./types.js";
import {availableCopilotAgentsToString, availableHelpersToString} from "./copilot-available-agents.js";
import {LLMAgent} from "../llm-agent.js";
import {COPILOT_AGENT_PROMPTS} from "../../prompts.js";
import {Agent} from "../../agent.decorator.js";
import {Inject} from "typedi";
import {llmClient} from "../../llm-client.js";


@Agent()
class CopilotOrchestratorAgent extends LLMAgent<CopilotOrchestratorAgentInput, void> {

    @Inject()
    private retrieveAgentsAgent: CopilotRetrieveAgentsAgent;

    async handleEvent(input: CopilotOrchestratorAgentInput): Promise<void> {
        const {req, res} = input;
        try {

            const tokenForUser = req.get("X-GitHub-Token");

            const octokit = new Octokit({auth: tokenForUser});
            const copilotMessages = req.body.messages;

            const content = copilotMessages[copilotMessages.length - 1].content;

            const messages = [{
                role: "user",
                content: content
            }]

            const retrievedAgents = await this.retrieveAgentsAgent.handleEvent(content);

            if(retrievedAgents.length == 0) {
                res.write(createTextEvent("### Sorry, I couldn't find what you're looking for. 😔\n\n"));
                res.write(createTextEvent(`Here are the available options:\n\n${availableHelpersToString()}\n\n`));
                return;
            }

            res.write(createTextEvent("### 🤖 Working on it...\n\n"));
            res.write(createTextEvent("Hang tight! I’m gathering the information you need.\n\n"));

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

            const prompt = this.createPrompt(COPILOT_AGENT_PROMPTS.ORCHESTRATOR, {
                userQuery: content,
                agentsReports: messages.filter(m => m.role === "agent").map(m => m.content).join("\n\n"),
            });

            const response = await llmClient.generateCompletion(prompt);

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