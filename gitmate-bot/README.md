# GitMate Bot 🤖

Github bot that assists issue tracking, pull request management, and code reviews, streamlining the development process.


## Usage

### Configuration

Register Your Bot on GitHub and install: 
```bash
npm install  
npm run build
npm run start
```
1. Next follow instructions to visit http://localhost:3000 (or your custom Glitch URL).
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