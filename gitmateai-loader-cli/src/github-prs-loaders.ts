import {api, octokit} from "./api.js";
import logger from "./logger.js";
import {PR} from "./types.js";

async function getAllPRs(owner: string, repo: string): Promise<any[]> {
    let pullRequests: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await octokit.rest.pulls.list({
            owner,
            repo,
            state: 'all',
            per_page: 100,
            page,
        });

        pullRequests = pullRequests.concat(response.data);
        hasMore = response.data.length === 100;
        page++;
    }

    return pullRequests;
}

async function sendPRToBackend(pr: PR): Promise<void> {
    if (pr.content?.length === 0 || pr.content === null || pr.content === undefined) {
        return;
    }

    try {
        await api.post("/pr-chunks", {
            content: pr.content,
            owner: pr.owner,
            repo: pr.repo,
            prNumber: pr.prNumber,
            type: pr.type,
            author: pr.author,
            commentId: pr.commentId,
        });
        logger.info(`PR type ${pr.type} of PR #${pr.prNumber} sent to backend successfully.`);
    } catch (error) {
        logger.error({
            msg: `Error sending PR type ${pr.type} from PR #${pr.prNumber} to backend:`,
            error: error.response?.data,
        });
    }
}

async function fetchAndPushPRComments(owner: string, repo: string, prNumber: number) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await octokit.rest.pulls.listReviewComments({
            owner,
            repo,
            pull_number: prNumber,
            per_page: 100,
            page,
        });

        const comments: any = response.data;

        for (const comment of comments) {
            await sendPRToBackend({
                content: comment.body,
                owner: owner,
                repo: repo,
                author: comment.user.login,
                prNumber: prNumber,
                type: 'review_comment',
                commentId: comment.id,
            });
        }

        hasMore = response.data.length === 100;
        page++;
    }
}

export async function fetchAndPushPRs(owner: string, repo: string): Promise<void> {
    try {
        const pullRequests = await getAllPRs(owner, repo);

        for (const pr of pullRequests) {
            await sendPRToBackend({
                content: pr.title,
                owner: owner,
                repo: repo,
                author: pr.user.login,
                prNumber: pr.number,
                type: 'title',
                commentId: null,
            });

            await sendPRToBackend({
                content: pr.body,
                owner: owner,
                repo: repo,
                author: pr.user.login,
                prNumber: pr.number,
                type: 'description',
                commentId: null,
            });

            if (pr.review_comments > 0) {
                await fetchAndPushPRComments(owner, repo, pr.number);
            }
        }

        logger.info('All pull requests and review comments processed successfully.');
    } catch (error) {
        logger.error({
            msg: `Error fetching pull requests and review comments for ${owner}/${repo}`,
            err: error,
        });
    }
}