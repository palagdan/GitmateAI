/**
 * Generates a standardized error message in markdown format.
 * @param agentName - The name of the agent (e.g., "IssueLabelAgent").
 * @param errorMessage - The specific error message from the caught error.
 * @returns A formatted error message in markdown.
 */
export function getErrorMsg(agentName: string, errorMessage: string): string {
    return formatMessage( `
    ## ${agentName} Report
    
    ### Status: Failed ❌

    ### Error Details
    - **Reason:** An unexpected error occurred while generating the ${agentName} report.
    - **Error Message:** \`${errorMessage}\`
    - **Suggested Action:** Please check the logs for more details or contact support if the issue persists.
    `);
}

export const formatMessage = (message: string): string  => {
    return message
        .split('\n')
        .map(line => line.trim())
        .join('\n')
        .trim();
}