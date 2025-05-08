import CopilotOrchestratorAgent from "./agents/copilot-agents/copilot-orchestrator.agent.js";
import {createAckEvent, createDoneEvent, createTextEvent} from "@copilot-extensions/preview-sdk";
import express, { Request, Response } from "express";
import {Container} from "typedi";


const routes = (app, getRouter) => {

    const routerBot = getRouter("");

    routerBot.post("/copilot", express.json(), async (req: Request, res: Response) => {

        res.setHeader('Content-Type', 'text/html');
        res.write(createAckEvent());
        await Container.get(CopilotOrchestratorAgent).handleEvent({req, res})
        res.end(createDoneEvent());
    });
}

export default routes;