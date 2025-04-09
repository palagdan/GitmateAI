import {octokit, api} from "./api.js";
import {shouldIgnore} from "./gitmate-ignore.js";
import logger from "./logger.js";

export async function fetchAndPushFileContent(owner: string, repo: string, filePath: string) {
    try {
        const fileResponse = await octokit.rest.repos.getContent({ owner, repo, path: filePath });

        if (!Array.isArray(fileResponse.data) && fileResponse.data.type === 'file' && fileResponse.data.content) {
            const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
            logger.info(`File: ${fileResponse.data.path}`);

            try {
                await api.post("/code-chunks", {
                    content: fileContent,
                    owner: owner,
                    repo: repo,
                    filePath: filePath
                });
                logger.info(`Successfully pushed file: ${filePath} in ${repo}`);
            } catch (pushError) {
                logger.error(`Error pushing file: ${filePath} in ${repo} to backend`, pushError);
            }
        } else {
            logger.warn(`Invalid file response for: ${filePath} in ${repo}`);
        }
    } catch (fetchError) {
        logger.error(`Error fetching file: ${filePath} in ${repo}`, fetchError);
    }
}

export async function fetchAndPushRepoContent(owner: string, repo: string, path: string = '', ignorePatterns: string[] = []) {
    try {
        const response = await octokit.rest.repos.getContent({ owner, repo, path });

        const contents = response.data;

        if (Array.isArray(contents)) {
            for (const item of contents) {
                if (shouldIgnore(item.path, ignorePatterns)) {
                    logger.info(`Skipping: ${item.path}`);
                    continue;
                }
                if (item.type === 'dir') {
                    await fetchAndPushRepoContent(owner, repo, item.path, ignorePatterns);
                } else if (item.type === 'file') {
                    await fetchAndPushFileContent(owner, repo, item.path);
                }
            }
        } else if (contents.type === 'file' && contents.content) {
            if (!shouldIgnore(contents.path, ignorePatterns)) {
                const fileContent = Buffer.from(contents.content, 'base64').toString('utf-8');
                logger.info(`File: ${contents.path}`);
            } else {
                logger.info(`Skipping: ${contents.path}`);
            }
        }
    } catch (error) {
        logger.error(`Error fetching content for ${repo}/${path}:`, error);
    }
}

