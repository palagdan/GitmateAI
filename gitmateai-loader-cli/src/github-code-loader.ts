import {octokit, api} from "./api.js";
import {shouldIgnore} from "./gitmateai-ignore.js";
import logger from "./logger.js";
import {isMarkdownFile} from "./utils.js";

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

export async function fetchAndPushKnowledgeBaseContent(owner: string, repo: string, filePath: string) {
    try {
        const fileResponse = await octokit.rest.repos.getContent({ owner, repo, path: filePath });

        if (!Array.isArray(fileResponse.data) && fileResponse.data.type === 'file' && fileResponse.data.content) {
            const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');

            try {
                await api.post("/convention-chunks", {
                    content: fileContent,
                    source: `https://github.com/${owner}/${repo}/blob/main/${filePath}`,
                });
                logger.info(`Successfully pushed knowledge base file: ${filePath} in ${repo}`);
            } catch (pushError) {
                logger.error(`Error pushing knowledge base file: ${filePath} in ${repo} to backend`, pushError);
            }
        } else {
            logger.warn(`Invalid knowledge base response for: ${filePath} in ${repo}`);
        }
    } catch (fetchError) {
        logger.error(`Error fetching knowledge base file: ${filePath} in ${repo}`, fetchError);
    }
}

export async function fetchAndPushRepoContent(owner: string, repo: string, path: string = '', ignorePatterns: string[] = [], isKnowledgeBase: boolean = false) {
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
                    if(isKnowledgeBase){
                        if(isMarkdownFile(item.path)) {
                            await fetchAndPushKnowledgeBaseContent(owner, repo, item.path);
                        }
                    }else{
                        if (!shouldIgnore(item.path, ignorePatterns)) {
                            logger.info(`Skipping: ${item.path}`);
                            continue;
                        }
                        await fetchAndPushFileContent(owner, repo, item.path);
                    }
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

