import {api, octokit} from "./api.js";
import logger from "./logger.js";
import {Issue, IssueContentType, PR, PRContentType} from "./types.js";


async function getAllIssuesAndPRs(owner: string, repo: string): Promise<any[]> {
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
        await api.post("/issue-chunks", issue);
        logger.info(`Issue type ${issue.type} of issue #${issue.issueNumber} sent to backend successfully.`);
    } catch (error) {
        logger.error( {
            msg: `Error sending issue type ${issue.type} from issue number #${issue.issueNumber} to backend:`,
            error: error.response.data
        });
    }
}

async function sendPRToBackend(pr: PR): Promise<void> {
    if(pr.content?.length === 0 || pr.content === null || pr.content === undefined) {
        return;
    }
    try {
        await api.post("/pr-chunks", pr);
        logger.info(`PR type ${pr.type} of PR #${pr.prNumber} sent to backend successfully.`);
    } catch (error) {
        logger.error( {
            msg: `Error sending PR type ${pr.type} from PR number #${pr.prNumber} to backend:`,
            error: error.response.data
        });
    }
}


async function fetchAndPushIssueComments(owner: string, repo: string, issueNumber: number, pr: boolean) {

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
            if(pr){
                await sendPRToBackend({
                    content: comment.body,
                    owner: owner,
                    repo: repo,
                    author: comment.user.login,
                    prNumber: issueNumber,
                    type: PRContentType.Comment,
                    commentId: comment.id,
                });
            }else{
                await sendIssueToBackend({
                    content: comment.body,
                    owner: owner,
                    repo: repo,
                    author: comment.user.login,
                    issueNumber: issueNumber,
                    type: IssueContentType.Comment,
                    commentId: comment.id,
                });
            }
        }

        hasMore = response.data.length === 100;
        page++;
    }
}

import parse from "parse-diff";
import {shouldIgnore} from "./gitmateai-ignore.js";

// Helper to fetch file changes for a PR
async function fetchPRFiles(owner: string, repo: string, prNumber: number) {
    const response = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
    });
    return response.data;
}


export async function fetchAndPushChanges(owner: string, repo: string, prNumber: number, author: string) {
    try {
        const files = await fetchPRFiles(owner, repo, prNumber);

        for (const file of files) {
            if(shouldIgnore(file.filename)) {
                continue
            }
            if (!file.patch) continue;

            const parsedFiles = parse(file.patch);

            for (const parsedFile of parsedFiles) {
                for (const hunk of parsedFile.chunks) {
                    const hunkText = hunk.content + '\n' + hunk.changes.map(change => change.content).join('\n');
                    await sendPRToBackend({
                        content: hunkText,
                        owner,
                        repo,
                        author: author,
                        prNumber,
                        type: PRContentType.Changes,
                        commentId: null,
                    });
                }
            }
        }

        logger.info(`PR changes for #${prNumber} pushed successfully.`);
    } catch (error) {
        logger.error({
            msg: `Failed to fetch or process PR #${prNumber} changes.`,
            err: error
        });
    }
}

export async function fetchAndPushIssuesAndPRs(owner: string, repo: string): Promise<void> {
    try {
        const issues = await getAllIssuesAndPRs(owner, repo);

        for (const issue of issues) {
            if (issue.pull_request) {
                await sendPRToBackend({
                    content: issue.title,
                    owner: owner,
                    repo: repo,
                    author: issue.user.login,
                    prNumber: issue.number,
                    type: PRContentType.Title,
                    commentId: null,
                })

                await sendPRToBackend({
                    content: issue.body,
                    owner: owner,
                    repo: repo,
                    author: issue.user.login,
                    prNumber: issue.number,
                    type: PRContentType.Description,
                    commentId: null,
                })

                await fetchAndPushIssueComments(owner, repo, issue.number, true);
                await fetchAndPushChanges(owner, repo, issue.number, issue.user.login);

            }else{
                await sendIssueToBackend({
                    content: issue.title,
                    owner: owner,
                    repo: repo,
                    author: issue.user.login,
                    issueNumber: issue.number,
                    type: IssueContentType.Title,
                    commentId: null,
                })

                await sendIssueToBackend({
                    content: issue.body,
                    owner: owner,
                    repo: repo,
                    author: issue.user.login,
                    issueNumber: issue.number,
                    type: IssueContentType.Description,
                    commentId: null,
                })

                await fetchAndPushIssueComments(owner, repo, issue.number, false);
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