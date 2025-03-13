import {api, octokit} from "./api.js";
import logger from "./logger.js";



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


async function getAllComments(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    let comments: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await octokit.rest.issues.listComments({
            owner,
            repo,
            issue_number: issueNumber,
            per_page: 100,
            page,
        });

        comments = comments.concat(response.data);
        hasMore = response.data.length === 100;
        page++;
    }

    return comments;
}


function generateIssueContent(issue: any): string {
    let content = `Issue #${issue.number}: ${issue.title}\n`;
    content += `Description: ${issue.body}\n`;
    content += `Comments:\n`;

    if (issue.commentsData.length > 0) {
        issue.commentsData.forEach((comment: any) => {
            content += `- ${comment.user.login}: ${comment.body}\n`;
        });
    } else {
        content += `- No comments\n`;
    }

    return content;
}


async function sendIssueToBackend(issueContent: any, owner: string, repo: string, issue: number): Promise<void> {
    try {
        await api.post("/issue-chunks", {
            content: issueContent,
            owner: owner,
            repo: repo,
            issue: issue
        });
        logger.info(`Issue #${issue} sent to backend successfully.`);
    } catch (error) {
        logger.error(`Error sending issue #${issue} to backend:`, error);
    }
}



export async function getRepoIssuesWithComments(owner: string, repo: string): Promise<void> {
    try {
        const issues = await getAllIssues(owner, repo);

        for (const issue of issues) {
            if (issue.comments > 0) {
                issue.commentsData = await getAllComments(owner, repo, issue.number);
            } else {
                issue.commentsData = [];
            }

            const issueContent = generateIssueContent(issue);
            await sendIssueToBackend(issueContent, owner, repo, issue.number);
        }

        logger.info('All issues and comments processed successfully.');
    } catch (error) {
        logger.error(`Error fetching issues and comments for ${owner}/${repo}:`, error);
    }
}