import {octokit} from "./api.js";
import logger from "./logger.js";

export async function getOrgRepositories(org: string): Promise<string[]> {
    let repositories: string[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await octokit.rest.repos.listForOrg({
                org,
                per_page: 100,
                page,
            });

            repositories = repositories.concat(response.data.map(repo => repo.name));
            hasMore = response.data.length === 100;
            page++;
        }

        return repositories;
    } catch (error) {
        logger.error("Error fetching repositories:", error);
        return [];
    }
}

export async function getRepositoriesForUser(username: string): Promise<string[]> {
    let repositories: string[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const response = await octokit.rest.repos.listForUser({
                username,
                per_page: 100,
                page,
            });

            repositories = repositories.concat(response.data.map(repo => repo.name));
            hasMore = response.data.length === 100;
            page++;
        }

        return repositories;
    } catch (error) {
        logger.error(`Error fetching repositories for ${username}:`, error);
        return [];
    }
}
