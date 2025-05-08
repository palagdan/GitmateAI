export const copilotAvailableAgents = {

    SEARCH_SEARCH_PRs: {
        name: "search_pull_requests_agent",
        description: "Searches for and retrieves pull requests in a repository that match the given query or problem description. " +
            "Helps identify related work, previous solutions, or ongoing changes that might be relevant to the user's current task",
        arguments: []
    },
    SEARCH_ISSUES_AGENT: {
        name: "search_issues_agent",
        description: "Finds and retrieves existing issues, bug reports, in a project or repository that are similar to a given issue " +
            "or problem description provided by the user. Useful for identifying duplicates or related problems.",
        arguments: []
    },
    SEARCH_CODE_SNIPPETS_AGENT: {
        name: "search_code_snippets_agent",
        description: "Searches the organization's codebase for code examples, configurations, or implementation patterns related to the" +
            " user's query. Returns relevant code snippets or notifies the user if none are found.",
        arguments: []
    },
    SEARCH_CONVENTIONS_AGENT: {
        name: "search_conventions_agent",
        description: `Finds documented rules, conventions, guidelines, or standard practices in ${process.env.ORGANIZATION_NAME} organization. ` +
            "Use this when looking for how things are supposed to be done, official processes, or agreed-upon ways of working. " +
            "Helpful for questions about roles, approvals, workflows, coding standards, or any established procedures.",
        arguments: []
    }  ,
    LIST_AVAILABLE_AGENTS_AGENT: {
        name: "list_available_agents_agent",
        description: "Provides a list of all available agents along with their names and descriptions. Helps users understand what functionalities " +
            "can be accessed through the agent.",
        arguments: []
    },

    SEARCH_COMMITS_AGENT: {
        name: "search_commits_agent",
        description: "Searches the commit history of a repository for specific changes, bug fixes, or feature implementations that are similar to a " +
            "given problem description provided by the user. ",
        arguments: []
    },

};

export const availableCopilotAgentsToString = () => {
    let result = '';
    Object.values(copilotAvailableAgents).forEach(agent => {
        result += `**Agent**: ${agent.name}\n\n`;
        result += `**Description**: ${agent.description}\n\n`;
        result += `**Arguments**: ${agent.arguments} \n\n`;
        result += `---\n\n`
    });
    return result.trim();
}
