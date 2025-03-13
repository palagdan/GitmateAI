#!/usr/bin/env node

import { Command } from "commander";
import "dotenv/config";
import { loadGitmateIgnore } from "./gitmate-ignore.js";
import { getOrgRepositories, getRepoContents, getRepositoriesForUser } from "./github-code-loaders.js";
import logger from "./logger.js";

const program = new Command();

program
    .name("gitmate-cli")
    .description("CLI tool to fetch and process GitHub repositories")
    .version("1.0.0");

program
    .command("org")
    .description("Load repositories from an organization and and send all its details to the specified backend.")
    .argument("<orgName>", "The GitHub organization name")
    .action(async (orgName) => {
        logger.info(`Fetching repositories for organization: ${orgName}`);

        const ignorePatterns = loadGitmateIgnore();
        logger.info("Loaded .gitmateignore:", ignorePatterns);

        const repositories = await getOrgRepositories(orgName);
        logger.info(`Found ${repositories.length} repositories.`);

        for (const repo of repositories) {
            logger.info(`\n📂 Processing repository: ${orgName}/${repo}`);
            await getRepoContents(orgName, repo, "", ignorePatterns);
        }
    });

program
    .command("user")
    .description("Load repositories for a specific GitHub user and send all its details to the specified backend.")
    .argument("<username>", "The GitHub username")
    .action(async (username) => {
        logger.info(`Fetching repositories for user: ${username}`);

        const ignorePatterns = loadGitmateIgnore();
        logger.info("Loaded .gitmateignore:", ignorePatterns);

        const repositories = await getRepositoriesForUser(username);
        logger.info(`Found ${repositories.length} repositories.`);

        for (const repo of repositories) {
            logger.info(`\n📂 Processing repository: ${username}/${repo}`);
            await getRepoContents(username, repo, "", ignorePatterns);
        }
    });

program
    .command("repo")
    .description("Retrieve a specific repository from a user or an organization and send all its details to the specified backend.")
    .argument("<name>", "Organization name or the user's username")
    .argument("<repoName>", "The repository name")
    .action(async (username, repoName) => {
        const ignorePatterns = loadGitmateIgnore();
        logger.info("Loaded .gitmateignore:", ignorePatterns);
        logger.info(`📂 Processing repository: ${username}/${repoName}`);
        await getRepoContents(username, repoName, "", ignorePatterns);
    });


program.parse(process.argv);
