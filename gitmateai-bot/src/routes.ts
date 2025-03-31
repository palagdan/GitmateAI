import express from "express";
import CopilotOrchestratorAgent from "./agents/copilot-agents/copilot-orchestrator.agent.js";
import {createAckEvent, createDoneEvent, createTextEvent} from "@copilot-extensions/preview-sdk";


const routes = (app, getRouter) => {

    const routerBot = getRouter("");

    routerBot.post("/copilot", express.json(), async (req, res) => {
        const copilotOrchestratorAgent= new CopilotOrchestratorAgent();
        res.write(createAckEvent());
        await copilotOrchestratorAgent.handleEvent({req, res})
        res.end(createDoneEvent());
    });
}

export default routes;