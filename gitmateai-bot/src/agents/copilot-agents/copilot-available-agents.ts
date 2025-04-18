export const copilotAvailableAgents = {
    SEARCH_SIMILAR_ISSUES_AGENT: {
        name: "search_issues_agent",
        description: "Finds and retrieves existing issues, bug reports, or pull requests (PRs) in a project or repository that are similar to a given issue or problem description provided by the user. Useful for identifying duplicates or related problems.",
        arguments: []
    },
    SEARCH_CODE_SNIPPETS_AGENT: {
        name: "search_code_snippets_agent",
        description: "Searches the organization's codebase for code examples, configurations, or implementation patterns related to the user's query. Returns relevant code snippets or notifies the user if none are found.",
        arguments: []
    },
    SEARCH_CONVENTIONS_AGENT: {
        name: "search_conventions_agent",
        description: "Retrieves coding rules, style guidelines, or conventions relevant to a project or language based on the user’s query. Useful for ensuring compliance with standards or understanding organization best practices.",
        arguments: []
    },
    VALIDATE_CODE_SECTION_AGAINST_CONVENTIONS_AGENT: {
        name: "validate_code_section_against_conventions_agent",
        description: "Validate a specific section of code against a set of coding conventions. Helps users identify potential violations or areas for improvement in their code.",
        arguments: []
    },
    LIST_AVAILABLE_AGENTS_AGENT: {
        name: "list_available_agents_agent",
        description: "Provides a list of all available agents along with their names and descriptions. Helps users understand what functionalities can be accessed through the agent.",
        arguments: []
    },

    SEARCH_COMMITS_AGENT: {
        name: "search_commits_agent",
        description: "Searches the commit history of a repository for specific changes, bug fixes, or feature implementations that are similar to a given problem description provided by the user. ",
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
