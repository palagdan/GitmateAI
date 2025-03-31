import {BaseAgent} from "../base.agent.js";
import {Octokit} from "octokit";
import {createAckEvent, createDoneEvent, createErrorsEvent, createTextEvent} from "@copilot-extensions/preview-sdk";
import ServicesRetrieverAgent from "./services-retriever.agent.js";
import CopilotAgentsFactory from "./copilot-agents-factory.js";
import logger from "../../logger.js";
import {CopilotOrchestratorAgentInput} from "./types.js";



class CopilotOrchestratorAgent implements BaseAgent<CopilotOrchestratorAgentInput, void> {

    async handleEvent(context: CopilotOrchestratorAgentInput): Promise<void> {
        const {req, res} = context;
        try {

            const tokenForUser = req.get("X-GitHub-Token");
            const octokit = new Octokit({auth: tokenForUser});
            const body = req.body;

            context.res.write(createAckEvent());
            const serviceRetrieverAgent = new ServicesRetrieverAgent();
            const content = body.messages[body.messages.length - 1].content;
            const retrievedServices = await serviceRetrieverAgent.handleEvent(content);

            if(retrievedServices.length == 0) {
                res.write(createTextEvent("Sorry, I couldn’t find any services matching your request. Please try again or provide more details!"));
                res.end(createDoneEvent());
                return;
            }

            const agents = CopilotAgentsFactory.createAgents(retrievedServices);
            agents.forEach(agent => agent.handleEvent({
                content: body.messages[body.messages.length - 1].content,
                octokit: octokit,
                copilot_references: body.messages[body.messages.length - 1].copilot_references,
                writeFunc: res.write
            }));

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
            res.end();
        }
    }
}

export default CopilotOrchestratorAgent;