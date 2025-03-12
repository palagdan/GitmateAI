import {octokit, api} from "./api.js";
import {shouldIgnore} from "./gitmate-ignore.js";

export async function fetchAndPushFileContent(owner: string, repo: string, filePath: string) {
    try {
        const fileResponse = await octokit.rest.repos.getContent({ owner, repo, path: filePath });

        if (!Array.isArray(fileResponse.data) && fileResponse.data.type === 'file' && fileResponse.data.content) {
            const fileContent = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
            console.log(`File: ${fileResponse.data.path}`);
            await api.post("/code-chunks", {
                content: fileContent,
                owner: owner,
                repo: repo,
                filePath: filePath
            })
        }
    } catch (error) {
        console.error(`Error fetching file: ${filePath} in ${repo}`, error);
    }
}

export async function getRepoContents(owner: string, repo: string, path: string = '', ignorePatterns: string[] = []) {
    try {
        const response = await octokit.rest.repos.getContent({ owner, repo, path });

        const contents = response.data;

        if (Array.isArray(contents)) {
            for (const item of contents) {
                if (shouldIgnore(item.path, ignorePatterns)) {
                    console.log(`Skipping: ${item.path}`);
                    continue;
                }
                if (item.type === 'dir') {
                    await getRepoContents(owner, repo, item.path, ignorePatterns);
                } else if (item.type === 'file') {
                    await fetchAndPushFileContent(owner, repo, item.path);
                }
            }
        } else if (contents.type === 'file' && contents.content) {
            if (!shouldIgnore(contents.path, ignorePatterns)) {
                const fileContent = Buffer.from(contents.content, 'base64').toString('utf-8');
                console.log(`File: ${contents.path}`);
            } else {
                console.log(`Skipping: ${contents.path}`);
            }
        }
    } catch (error) {
        console.error(`Error fetching content for ${repo}/${path}:`, error);
    }
}

export async function getOrgRepositories(org: string): Promise<string[]> {
    try {
        const response = await octokit.rest.repos.listForOrg({org, per_page: 100});
        return response.data.map(repo => repo.name);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

export async function getRepositoriesForUser(username: string): Promise<string[]> {
    try {
        const response = await octokit.rest.repos.listForUser({ username, per_page: 100 });
        return response.data.map(repo => repo.name);
    } catch (error) {
        console.error(`Error fetching repositories for ${username}:`, error);
        return [];
    }
}
