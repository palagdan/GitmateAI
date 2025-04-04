import  { Request, Response } from "express";

export interface CopilotOrchestratorAgentInput {
    req: Request;
    res: Response;
}

export interface CopilotAgentInput {
    content: string;
    octokit: any;
    copilot_references: any;
    writeFunc: any;
}
