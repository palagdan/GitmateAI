

export function isPullRequest(context) {
    return context.payload.issue?.pull_request !== undefined;
}