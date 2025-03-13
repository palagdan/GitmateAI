# Gitmate Loader CLI

The Gitmate Loader CLI is CLI tool that retrieves content from specific organizations, repositories, or users and populates the backend database with this information.
## Usage

### Configuration
Before running the scripts, you need to configure the .env file with the required environment variables, see [.env.example](.env.example).
This includes setting the backend URL where all the information will be pushed and providing your GitHub access token.

To generate a GitHub access token, follow these steps:
1. In the upper-right corner of any page on GitHub, click your profile photo, then click  Settings.

2. In the left sidebar, click  Developer settings.

3. In the left sidebar, under  Personal access tokens, click Fine-grained tokens.

4. Click Generate new token.

5. Assign this token to the 'GITHUB_TOKEN' variable.

### Running the tool
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
npm install
npm run build
npm run start [options] [command] 
```

### .GITMATEIGNORE
If you wish to exclude specific file extensions from being retrieved and stored, add them to the `.gitmateignore` file.


