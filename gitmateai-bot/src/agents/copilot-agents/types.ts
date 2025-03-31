

export interface CopilotOrchestratorAgentInput {
    req: any;
    res: any;
}

export interface CopilotAgentInput {
    content: string;
    octokit: any;
    copilot_references: any;
    writeFunc: any;
}