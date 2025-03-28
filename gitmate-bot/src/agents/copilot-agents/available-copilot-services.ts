



export const availableCopilotServices = {
    SEARCH_SIMILAR_ISSUES: {
        name: "search_similar_issues",
        description: "Finds and retrieves existing issues or bug reports in a project or repository that are similar to a given issue or problem description provided by the user. Useful for identifying duplicates or related problems."
    },
    SEARCH_SIMILAR_PR: {
        name: "search_similar_pr",
        description: "Searches for pull requests (PRs) in a project or repository that are similar to a specified pull request or code change description. Helps users discover related PRs for comparison or context."
    },
    SEARCH_SIMILAR_CODE_SECTION: {
        name: "search_similar_code_section",
        description: "Locates sections of code within a project or repository that closely match a given code snippet or description provided by the user. Useful for finding reusable code, detecting duplication, or exploring similar implementations."
    },
    SEARCH_RULES: {
        name: "search_rules_conventions",
        description: "Retrieves coding rules, style guidelines, or conventions relevant to a project or language based on the user’s query. Useful for ensuring compliance with standards or understanding best practices."
    },
    VALIDATE_CODE_SECTION_AGAINST_RULES: {
        name: "validate_code_section_against_rules",
        description: "Validate a specific section of code against a set of coding rules or conventions. Helps users identify potential violations or areas for improvement in their code."
    },
};

export const availableCopilotServicesToString = () => {
    let result = '';
    Object.values(availableCopilotServices).forEach(service => {
        result += `Service: ${service.name}\n`;
        result += `Description: ${service.description}\n\n`;
    });
    return result.trim();
}
