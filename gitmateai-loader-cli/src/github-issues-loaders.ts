import {api, octokit} from "./api.js";
import logger from "./logger.js";
import {Issue} from "./types.js";



async function getAllIssues(owner: string, repo: string): Promise<any[]> {
    let issues: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'all',
            per_page: 100,
            page,
        });

        issues = issues.concat(response.data);
        hasMore = response.data.length === 100;
        page++;
    }

    return issues;
}


async function sendIssueToBackend(issue: Issue): Promise<void> {
    try {
        await api.post("/issue-chunks", {
            content: issue.content,
            owner: issue.owner,
            repo: issue.repo,
            issueId: issue.issueId,
            type: issue.type,
            author: issue.author,
            commentId: issue.commentId
        });
        logger.info(`Issue #${issue} sent to backend successfully.`);
    } catch (error) {
        logger.error(`Error sending issue #${issue} to backend:`, error);
    }
}


async function fetchAndPushIssueComments(owner: string, repo: string, issueId: number) {

    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number: issueId,
            per_page: 100,
            page,
        });
        const comment: any = response.data;

        await sendIssueToBackend({
            content: comment.body,
            owner: owner,
            repo: repo,
            author: comment.user.login,
            issueId: issueId,
            type: 'comment',
            commentId: comment.id,
        })

        hasMore = response.data.length === 100;
        page++;
    }

}


export async function fetchAndPushIssues(owner: string, repo: string): Promise<void> {
    try {
        const issues = await getAllIssues(owner, repo);

        for (const issue of issues) {

            await sendIssueToBackend({
                content: issue.title,
                owner: issue.owner,
                repo: issue.repo,
                author: issue.author,
                issueId: issue.id,
                type: 'title',
                commentId: undefined,
            })

            await sendIssueToBackend({
                content: issue.body,
                owner: issue.owner,
                repo: issue.repo,
                author: issue.author,
                issueId: issue.id,
                type: 'description',
                commentId: undefined,
            })

            if (issue.comments > 0) {
                issue.commentsData = await fetchAndPushIssueComments(owner, repo, issue.number);
            } else {
                issue.commentsData = [];
            }

        }

        logger.info('All issues and comments processed successfully.');
    } catch (error) {
        logger.error(`Error fetching issues and comments for ${owner}/${repo}:`, error);
    }
}