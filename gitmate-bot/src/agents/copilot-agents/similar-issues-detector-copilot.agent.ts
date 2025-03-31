import {LlmAgent} from "../llm.agent.js";
import SimilarIssuesDetectorAgent from "../common/similar-issue-detector.agent.js";
import logger from "../../logger.js";
import {CopilotAgentInput} from "./types.js";

export class SimilarIssuesDetectorCopilotAgent extends LlmAgent<CopilotAgentInput, void> {


    async handleEvent(context: CopilotAgentInput): Promise<void> {


    }
}