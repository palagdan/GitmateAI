import {availableCopilotServices} from "./available-copilot-services.js";
import {SimilarIssuesDetectorCopilotAgent} from "./similar-issues-detector-copilot.agent.js";
import {SimilarCodeSectionsCopilotAgent} from "./similar-code-sections-detector-copilot.agent.js";
import RulesSearcherAgent from "./rules-searcher.agent.js";
import CodeSectionValidatorAgent from "./code-section-validator.agent.js";


class CopilotAgentsFactor {


    static createAgent(service: string) {
        switch (service) {
             case availableCopilotServices.SEARCH_SIMILAR_ISSUES.name:
                 return new SimilarIssuesDetectorCopilotAgent();
             case availableCopilotServices.SEARCH_SIMILAR_PR.name:
                 break;
             case availableCopilotServices.SEARCH_SIMILAR_CODE_SECTION.name:
                 return new SimilarCodeSectionsCopilotAgent();
             case availableCopilotServices.SEARCH_RULES.name:
                 return new RulesSearcherAgent();
             case availableCopilotServices.VALIDATE_CODE_SECTION_AGAINST_RULES.name:
                 return new CodeSectionValidatorAgent();
        }
        return null;
    }

    static createAgents(services: string[]) {
        return services.map(service => this.createAgent(service));
    }
}

export default CopilotAgentsFactor