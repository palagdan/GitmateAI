
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

### Running the Backend

To start the GitMate backend in development mode, follow these steps:

```bash
cd gitmate-backend
npm install  
npm run start:dev
```

### Running the Gitmate Bot
To build and start the GitMate bot, execute the following commands:

```bash
cd gitmate-bot
npm install 
npm run build
npm run start
```

### Populating the Database with Data Chunks

```markdown
Usage: gitmate-cli [options] [command]

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
```bash
cd gitmate-loader-cli
npm install
npm run build
npm run start [options] [command] # You can you just gitmate-cli
```
If you wish to exclude specific file extensions from being retrieved and stored, add them to the `.gitmateignore` file.

## Production Setup
For production deployment, use docker-compose.prod.yml, which sets up all necessary services.
