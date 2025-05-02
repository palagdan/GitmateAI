import {copilotAvailableAgents} from "./copilot-available-agents.js";
import CopilotSearchCodeAgent from "./copilot-search-code.agent.js";
import CopilotSearchConventionAgent from "./copilot-search-convention.agent.js";
import CopilotSearchIssuesAgent from "./copilot-search-issues.agent.js";
import CopilotListAvailableAgentsAgent from "./copilot-list-available-agents.agent.js";
import CopilotSearchCommitsAgent from "./copilot-search-commits.agent.js";
import CopilotSearchPRsAgent from "./copilot-search-prs.agent.js";


class CopilotAgentsFactor {

    static createAgent(service: string) {
        switch (service) {
            case copilotAvailableAgents.SEARCH_ISSUES_AGENT.name:
                return new CopilotSearchIssuesAgent();
            case copilotAvailableAgents.SEARCH_CODE_SNIPPETS_AGENT.name:
                return new CopilotSearchCodeAgent()
            case copilotAvailableAgents.SEARCH_CONVENTIONS_AGENT.name:
                return new CopilotSearchConventionAgent();
            case copilotAvailableAgents.LIST_AVAILABLE_AGENTS_AGENT.name:
                return new CopilotListAvailableAgentsAgent()
            case copilotAvailableAgents.SEARCH_COMMITS_AGENT.name:
                return new CopilotSearchCommitsAgent();
            case copilotAvailableAgents.SEARCH_SEARCH_PRs.name:
                return new CopilotSearchPRsAgent();
        }
        return null;
    }

    static createAgents(agents: { name: string; params: any }[]) {
        return agents.map(({name, params}) => ({
            agent: this.createAgent(name),
            params
        }));
    }
}

export default CopilotAgentsFactor