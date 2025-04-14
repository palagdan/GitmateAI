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
    if(issue.content?.length === 0 || issue.content === null || issue.content === undefined) {
        return;
    }

    try {
        await api.post("/issue-chunks", {
            content: issue.content,
            owner: issue.owner,
            repo: issue.repo,
            issueNumber: issue.issueNumber,
            type: issue.type,
            author: issue.author,
            commentId: issue.commentId
        });
        logger.info(`Issue type ${issue.type} of issue #${issue.issueNumber} sent to backend successfully.`);
    } catch (error) {
        logger.error( {
            msg: `Error sending issue type ${issue.type} from issue number #${issue.issueNumber} to backend:`,
            error: error.response.data
        });
    }
}


async function fetchAndPushIssueComments(owner: string, repo: string, issueNumber: number) {

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

        const comments: any = response.data;

        for (const comment of comments) {
            await sendIssueToBackend({
                content: comment.body,
                owner: owner,
                repo: repo,
                author: comment.user.login,
                issueNumber: issueNumber,
                type: 'comment',
                commentId: comment.id,
            });
        }

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
                owner: owner,
                repo: repo,
                author: issue.user.login,
                issueNumber: issue.number,
                type: 'title',
                commentId: null,
            })

            await sendIssueToBackend({
                content: issue.body,
                owner: owner,
                repo: repo,
                author: issue.user.login,
                issueNumber: issue.id,
                type: 'description',
                commentId: null,
            })

            if (issue.comments > 0) {
                issue.commentsData = await fetchAndPushIssueComments(owner, repo, issue.number);
            } else {
                issue.commentsData = [];
            }
        }

        logger.info('All issues and comments processed successfully.');
    } catch (error) {
        logger.error({
            msg: `Error fetching issues and comments for ${owner}/${repo}`,
            err: error
        });
    }
}