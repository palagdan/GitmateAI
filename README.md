
# GitMate

AI-driven github bot can automate tasks such as issue tracking, pull request management, and code reviews, streamlining the development process.


## Application Overview
Application consists of 5 modules: 
- `gitmate-backend` - Manages information chunks for issues, pull requests (PRs), code base, rules, and conventions.
- `gitmate-bot` - Github bot that assists issue tracking, pull request management, and code reviews, streamlining the development process.
- `gitmate-loader-cli` - A CLI tool that retrieves content from specific organizations, repositories, or users and populates the backend database with this information.
- `weaviate` - An open-source vector database that stores both objects and vectors, enabling the combination of vector search with structured filtering. It offers the fault tolerance and scalability of a cloud-native database.
- `ollama` - : A lightweight, extensible framework for building and running language models on a local machine. It provides a simple API for creating, running, and managing models, along with a library of pre-built models for various applications.

## Development Setup

To set up the development environment, use `docker-compose.dev.yml`, which runs the vector database alongside Ollama with the embedded model.

### Running the Gitmate-Backend

To start the GitMate backend in development mode, follow these steps:

```bash
cd gitmate-backend
npm install  
npm run start:dev
```

### Guide to Register Your Bot on GitHub and Configure the Gitmate-bot

Register Your Bot on GitHub and install: 
```bash
cd gitmate-bot
npm install  
npm run build
npm run start
```
1. Next follow instructions to visit http://localhost:3001 (or your custom Glitch URL).
2. Go ahead and click the Register a GitHub App button.
3. Next, you'll get to decide on an app name that isn't already taken. Note: if you see a message "Name is already in use" although no such app exists, it means that a GitHub organization with that name exists and cannot be used as an app name.
4. After registering your GitHub App, you'll be redirected to install the app on any repositories. At the same time, you can check your local .env and notice it will be populated with values GitHub sends us in the course of that redirect.
5. Stop the server in your terminal
6. Configure the following environment variables in `.env`:
   - `LLM_API_KEY`: Your OpenAI API key. You can obtain this key by visiting [OpenAI Platform](https://platform.openai.com/).
   - `LLM_MODEL_NAME`: The name of the model you intend to use (by default `gpt-4o-mini`).
   - `BACKEND_URL`: The URL for your backend service. (by default `http://localhost:8081/v1`).
7. Start the server in you terminal with `npm run start`:
8. Install the app on your repositories.
9. Try triggering a webhook to activate the bot!

### Gitmate-Loader-CLI - Populating the Database with Data Chunks. 
```bash
cd gitmate-loader-cli
```
Before running the scripts, you need to configure the .env file with the required environment variables, see [.env.example](gitmate-loader-cli/.env.example).
This includes setting the backend URL where all the information will be pushed and providing your GitHub access token.

To generate a GitHub access token, follow these steps:
1. In the upper-right corner of any page on GitHub, click your profile photo, then click  Settings.

2. In the left sidebar, click  Developer settings.

3. In the left sidebar, under  Personal access tokens, click Fine-grained tokens.

4. Click Generate new token.

5. Assign this token to the 'GITHUB_TOKEN' variable.

```markdown
Usage: gitmate-loader-cli [options] [command]

CLI tool to fetch and process GitHub repositories

Options:
-V, --version           output the version number
-h, --help              display help for command

Commands:
org <orgName>           Load repositories from an organization and and send all its details to the specified backend.
user <username>         Load repositories for a specific GitHub user and send all its details to the specified backend.
repo <name> <repoName>  Retrieve a specific repository from a user or an organization and send all its details to the specified backend.
help [command]          display help for command
```
> **🚨 Important:** To use the `gitmate-loader-cli` command, you must install it globally. Otherwise, use the commands provided below.
```bash
cd gitmate-loader-cli
npm install
npm run build
npm run start [options] [command] 
```
If you wish to exclude specific file extensions from being retrieved and stored, add them to the `.gitmateignore` file.



## Production Setup
For production deployment, use docker-compose.prod.yml, which sets up all necessary services.
