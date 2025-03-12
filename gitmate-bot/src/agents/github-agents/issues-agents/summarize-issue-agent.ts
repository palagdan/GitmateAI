import {LLMAgent} from "../../llm-agent.js";
import {Context} from "probot";
import OpenAI from "openai";
import {GitHubService} from "../../../services/github-service.js";

export class SummarizeIssueAgent extends LLMAgent<Context, void> {

    constructor(llmClient: any, private gitHubService: GitHubService) {
        const prompt: string = `
        Summarize the following GitHub issue based on its title, description, and comments. Focus on the key points, problems, and solutions discussed.

        **Issue Title**: {title}
        **Issue Description**: {description}

        **Comments**:
        {comments}

        Provide a concise summary of the issue, including:
        1. The main problem or feature request.
        2. Key points discussed in the comments.
        3. Any proposed solutions or next steps.
        `;
        super(llmClient, prompt);
    }

    async handleEvent(event: Context): Promise<void> {
        const issue = await this.gitHubService.getIssue(event);
        const comments = await this.gitHubService.listComments(event);

        const issueTitle = issue.data.title;
        const issueDescription = issue.data.body || "";
        const commentsText = comments
            .map((comment: any) => `Comment by ${comment.user.login}: ${comment.body}`)
            .join("\n");

        const prompt = this.createPrompt( {
            title: issueTitle,
            description: issueDescription,
            comments: commentsText,
        })

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [{role: "user", content: prompt}],
            model: process.env.LLM_MODEL_NAME|| "gpt-4o-mini",
        };

        const chatCompletion = await this.llmClient.chat.completions.create(params);
        const responseText: string = chatCompletion.choices[0]?.message?.content?.trim() || "No summary generated.";

        await this.gitHubService.createComment(event, responseText);

        event.log.debug("Issue Summary:", responseText);
    }
}