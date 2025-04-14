import {BaseAgent} from "../base.agent.js";
import {Octokit} from "octokit";
import { createErrorsEvent, createTextEvent} from "@copilot-extensions/preview-sdk";
import CopilotRetrieveServicesAgent from "./copilot-retrieve-services.agent.js";
import CopilotAgentsFactory from "./copilot-agents-factory.js";
import logger from "../../logger.js";
import {CopilotOrchestratorAgentInput} from "./types.js";
import {availableCopilotServicesToString} from "./copilot-available-services.js";



class CopilotOrchestratorAgent implements BaseAgent<CopilotOrchestratorAgentInput, void> {

    async handleEvent(input: CopilotOrchestratorAgentInput): Promise<void> {
        const {req, res} = input;
        try {

            const tokenForUser = req.get("X-GitHub-Token");

            const octokit = new Octokit({auth: tokenForUser});
            const messages = req.body.messages;

            const serviceRetrieverAgent = new CopilotRetrieveServicesAgent();
            const content = messages[messages.length - 1].content;
            const retrievedServices = await serviceRetrieverAgent.handleEvent(content);
            if(retrievedServices.length == 0) {
                res.write(createTextEvent("### Oops! 😔 I couldn’t find any services matching your request.\n"));
                res.write(createTextEvent(`Available services are:\n${availableCopilotServicesToString()}`));
                return;
            }

            res.write(createTextEvent("## 🎯 Here are the services that match your request: " + retrievedServices.toString() + "\n"));
            const agents = CopilotAgentsFactory.createAgents(retrievedServices);
            for (const agent of agents) {
                await agent.handleEvent({
                    content: content,
                    octokit: octokit,
                    copilot_references: messages[messages.length - 1].copilot_references,
                    writeFunc: res.write.bind(res),
                });
            }

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