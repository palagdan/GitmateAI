import {copilotAvailableAgents} from "./copilot-available-agents.js";

import CopilotSearchCodeAgent from "./copilot-search-code.agent.js";
import CopilotValidateCodeSectionAgent from "./copilot-validate-code-section.agent.js";
import CopilotSearchConventionAgent from "./copilot-search-convention.agent.js";
import CopilotSearchIssuesAgent from "./copilot-search-issues.agent.js";
import CopilotListAvailableAgentsAgent from "./copilot-list-available-agents.agent.js";


class CopilotAgentsFactor {

    static createAgent(service: string) {
        switch (service) {
             case copilotAvailableAgents.SEARCH_SIMILAR_ISSUES_AGENT.name:
                 return new CopilotSearchIssuesAgent();
             case copilotAvailableAgents.SEARCH_SIMILAR_PR_AGENT.name:
                 break;
             case copilotAvailableAgents.SEARCH_CODE_SNIPPETS_AGENT.name:
                 return new CopilotSearchCodeAgent()
             case copilotAvailableAgents.SEARCH_CONVENTIONS_AGENT.name:
                 return new CopilotSearchConventionAgent();
             case copilotAvailableAgents.VALIDATE_CODE_SECTION_AGAINST_CONVENTIONS_AGENT.name:
                 return new CopilotValidateCodeSectionAgent();
             case copilotAvailableAgents.LIST_AVAILABLE_AGENTS_AGENT.name:
                 return new CopilotListAvailableAgentsAgent()
        }
        return null;
    }

    static createAgents(agents: { name: string; params: any }[]) {
        return agents.map(({ name, params }) => ({
            agent: this.createAgent(name),
            params
        }));
    }
}

export default CopilotAgentsFactor