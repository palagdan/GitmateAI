export const copilotAvailableServices = {
    SEARCH_SIMILAR_ISSUES: {
        name: "search_similar_issues",
        description: "Finds and retrieves existing issues or bug reports in a project or repository that are similar to a given issue or problem description provided by the user. Useful for identifying duplicates or related problems.",
    },
    SEARCH_SIMILAR_PR: {
        name: "search_similar_pr",
        description: "Searches for pull requests (PRs) in a project or repository that are similar to a specified pull request or code change description. Helps users discover related PRs for comparison or context."
    },
    SEARCH_CODE_SNIPPETS: {
        name: "search_code_snippets",
        description: "Searches the organization's codebase for code examples, configurations, or implementation patterns related to the user's query. Returns relevant code snippets or notifies the user if none are found."
    },
    SEARCH_CONVENTIONS: {
        name: "search_conventions",
        description: "Retrieves coding rules, style guidelines, or conventions relevant to a project or language based on the user’s query. Useful for ensuring compliance with standards or understanding organization best practices."
    },
    VALIDATE_CODE_SECTION_AGAINST_CONVENTIONS: {
        name: "validate_code_section_against_conventions",
        description: "Validate a specific section of code against a set of coding conventions. Helps users identify potential violations or areas for improvement in their code."
    },

    LIST_AVAILABLE_SERVICES: {
        name: "list_available_services",
        description: "Provides a list of all available services along with their names and descriptions. Helps users understand what functionalities can be accessed through the agent."
    }
};

export const availableCopilotServicesToString = () => {
    let result = '';
    Object.values(copilotAvailableServices).forEach(service => {
        result += `**Service**: ${service.name}\n\n`;
        result += `**Description**: ${service.description}\n\n`;
        result += `---\n\n`
    });
    return result.trim();
}
