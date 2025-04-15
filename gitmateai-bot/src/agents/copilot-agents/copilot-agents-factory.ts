import {copilotAvailableServices} from "./copilot-available-services.js";

import CopilotSearchCodeAgent from "./copilot-search-code.agent.js";
import CopilotValidateCodeSectionAgent from "./copilot-validate-code-section.agent.js";
import CopilotSearchConventionAgent from "./copilot-search-convention.agent.js";
import CopilotSearchIssuesAgent from "./copilot-search-issues.agent.js";
import CopilotListAvailableServicesAgent from "./copilot-list-available-services.agent.js";


class CopilotAgentsFactor {


    static createAgent(service: string) {
        switch (service) {
             case copilotAvailableServices.SEARCH_SIMILAR_ISSUES.name:
                 return new CopilotSearchIssuesAgent();
             case copilotAvailableServices.SEARCH_SIMILAR_PR.name:
                 break;
             case copilotAvailableServices.SEARCH_CODE_SNIPPETS.name:
                 return new CopilotSearchCodeAgent()
             case copilotAvailableServices.SEARCH_CONVENTIONS.name:
                 return new CopilotSearchConventionAgent();
             case copilotAvailableServices.VALIDATE_CODE_SECTION_AGAINST_CONVENTIONS.name:
                 return new CopilotValidateCodeSectionAgent();
             case copilotAvailableServices.LIST_AVAILABLE_SERVICES.name:
                 return new CopilotListAvailableServicesAgent()
        }
        return null;
    }

    static createAgents(services: string[]) {
        return services.map(service => this.createAgent(service));
    }
}

export default CopilotAgentsFactor