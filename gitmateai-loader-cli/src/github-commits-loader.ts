
import { api, octokit } from "./api.js";
import logger from "./logger.js";
import { Commit } from "./types.js";

async function getAllCommits(owner: string, repo: string): Promise<any[]> {
    let commits: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await octokit.rest.repos.listCommits({
                owner,
                repo,
                per_page: 100,
                page,
            });

            commits = commits.concat(response.data);
            hasMore = response.data.length === 100;
            page++;
        } catch (error) {
            logger.error({
                msg: `Error fetching commits page ${page} for ${owner}/${repo}`,
                error,
            });
            break;
        }
    }

    return commits;
}

async function sendCommitToBackend(commitData: Commit): Promise<void> {
    if (!commitData.content || commitData.content.length === 0) {
        return;
    }

    try {
        await api.post("/commit-chunks", commitData);
        logger.info(`Commit ${commitData.sha} sent to backend successfully.`);
    } catch (error) {
        logger.error({
            msg: `Error sending commit ${commitData.sha} to backend:`,
            error: error.response?.data || error,
        });
    }
}

async function fetchAndPushCommitDiffs(owner: string, repo: string, commit: any) {
    try {
        const response = await octokit.rest.repos.getCommit({
            owner,
            repo,
            ref: commit.sha,
        });

        const files = response.data.files || [];

        for (const file of files) {
            await sendCommitToBackend({
                content: file.patch || "",
                fileName: file.filename,
                commitMessage: commit.commit.message,
                owner,
                repo,
                sha: commit.sha,
                author: commit.author.login,
            });
        }
    } catch (error) {
        logger.error({
            msg: `Error fetching diff for commit ${commit.sha}`,
            error,
        });
    }
}

export async function fetchAndPushCommits(owner: string, repo: string): Promise<void> {
    try {
        const commits = await getAllCommits(owner, repo);

        for (const commit of commits) {
            await fetchAndPushCommitDiffs(owner, repo, commit);
        }

        logger.info(`All commits processed successfully for ${owner}/${repo}`);
    } catch (error) {
        logger.error({
            msg: `Error processing commits for ${owner}/${repo}`,
            error,
        });
    }
}