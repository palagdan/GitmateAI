import { Command } from "commander";
import "dotenv/config";
import { fetchAndPushRepoContent } from "./github-code-loader.js";
import logger from "./logger.js";
import {fetchAndPushIssuesAndPRs} from "./github-issues-loader.js";
import {getOrgRepositories, getRepositoriesForUser} from "./github-repos-loader.js";
import {fetchAndPushCommits} from "./github-commits-loader.js";
import {isKnowledgeBase} from "./utils.js";
const program = new Command();

program
    .name("gitmateai-loader-cli")
    .description("CLI tool to fetch and process GitHub repositories")
    .version("1.0.0");

program
    .command("org")
    .description("Load repositories from an organization and and send all its details to the specified backend.")
    .argument("<orgName>", "The GitHub organization name")
    .action(async (orgName) => {
        logger.info(`Fetching repositories for organization: ${orgName}`);

        const repositories = await getOrgRepositories(orgName);
        logger.info(`Found ${repositories.length} repositories.`);

        for (const repo of repositories) {
            logger.info(`\n📂 Processing repository: ${orgName}/${repo}`);
            if(isKnowledgeBase(orgName, repo)) {
                await fetchAndPushRepoContent(orgName, repo, "", true);
            }else{
                await fetchAndPushRepoContent(orgName, repo, "");
                await fetchAndPushIssuesAndPRs(orgName, repo);
                await fetchAndPushCommits(orgName, repo);
            }
        }
    });

program
    .command("user")
    .description("Load repositories for a specific GitHub user and send all its details to the specified backend.")
    .argument("<username>", "The GitHub username")
    .action(async (username) => {
        logger.info(`Fetching repositories for user: ${username}`);

        const repositories = await getRepositoriesForUser(username);
        logger.info(`Found ${repositories.length} repositories.`);
        for (const repo of repositories) {
            logger.info(`\n📂 Processing repository: ${username}/${repo}`);
            if(isKnowledgeBase(username, repo)) {
                await fetchAndPushRepoContent(username, repo, "", true);
            }else{
                await fetchAndPushRepoContent(username, repo, "");
                await fetchAndPushIssuesAndPRs(username, repo);
                await fetchAndPushCommits(username, repo);
            }
        }
    });

program
    .command("repo")
    .description("Retrieve a specific repository from a user or an organization and send all its details to the specified backend.")
    .argument("<name>", "Organization name or the user's username")
    .argument("<repoName>", "The repository name")
    .action(async (username, repo) => {
        logger.info("Loaded .gitmateaiignore:");
        logger.info(`📂 Processing repository: ${username}/${repo}`);
        if(isKnowledgeBase(username, repo)) {
            await fetchAndPushRepoContent(username, repo, "", true);
        }else{
            await fetchAndPushRepoContent(username, repo, "");
            await fetchAndPushIssuesAndPRs(username, repo);
            await fetchAndPushCommits(username, repo);
        }
    });


program.parse(process.argv);


