import { Context } from "probot";
import OpenAI from "openai";
import {LLMAgent} from "../../llm-agent.js";
import gitmate from "../../../api/gitmate-rest.js";
import {getErrorMsg} from "../../../messages/messages.js";


export class SimilarIssuesDetectorAgent extends LLMAgent<Context, string> {

    constructor(llmClient: OpenAI) {
        const prompt = `
        You are a GitHub assistant specializing in identifying similar past issues to help users efficiently. Your task is to analyze a newly created issue and determine if any past issues share relevant similarities. 
        **You must only use the information provided in the context below and must not generate any information outside of it.**

        ### **New Issue Details**
        **Title:** "{{issueTitle}}"
        **Description:** "{{issueBody}}"

        ### **Similar Past Issues**
        {{similarIssues}}

        ### **Response Instructions**
        - **Strictly base your response on the provided context.** Do not infer, assume, or generate any information not explicitly provided in the context.
        - If relevant past issues exist, summarize their connection to the new issue in a **concise** and **clear** manner.
        - **Strictly reference** past issues using the format: owner/repo#issue_id (e.g., palagdan/actions_test_repo#59).
        - If no similar issues exist, explicitly state: "There are no similar issues found in the database."
        - **Do not** suggest solutions unless the user explicitly requests one.
        - **Do not** add any additional commentary, explanations, or information beyond what is required in the response format.

        ### **Response Format (Strict)**
        Your response **must** be in the following **markdown format** if there are similar issues:

        ### SimilarIssuesDetectorAgent Report 🤖

        {{Your summary of the similar issues here, referencing past issues using the format owner/repo#issue_id.}}

        ### **Response Format (Strict)**
        Your response **must** be in the following **markdown format** if there are no similar issues:
       
        ### SimilarIssuesDetectorAgent Report 🤖
      
        There are no similar issues found in the database.
`
        super(llmClient, prompt);
    }

    async handleEvent(context: Context): Promise<string> {
        try {
            const { owner, repo, issue_number } = context.issue();
            const issue = await context.octokit.issues.get({ owner, repo, issue_number });

            const issueText = `${issue.data.title}\n\n${issue.data.body || ""}`;

            const similarIssues = await gitmate.issueChunks.search({
                content: issueText,
                limit: 10
            });

            const formattedIssues = this.formatSimilarIssues(similarIssues.data);

            // Generate LLM response
            const prompt = this.createPrompt({
                issueTitle: issue.data.title,
                issueBody: issue.data.body || "",
                similarIssues: formattedIssues,
            });

            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                messages: [{ role: "user", content: prompt }],
                model: process.env.LLM_MODEL_NAME || "gpt-4o-mini",
            };

            const chatCompletion = await this.llmClient.chat.completions.create(params);
            const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";

            let responseBody: string;
            try {
                const parsed = JSON.parse(responseText);
                responseBody = parsed.response || "No relevant response generated.";
            } catch (e) {
                context.log.warn("LLM response not in expected JSON format, using raw text.");
                responseBody = responseText;
            }

            return responseBody;
        } catch (error) {
            context.log.error(`Error in SimilarIssuesDetectorAgent: ${(error as Error).message}`);
            return getErrorMsg(this.constructor.name, error);
        }
    }

    private formatSimilarIssues(similarIssues: any[]): string {
        if (!similarIssues || similarIssues.length === 0) {
            return "No similar issues were found in the database.";
        }

        return similarIssues
            .map((chunk, index) => {
                const { owner, repo, issue, content } = chunk.properties || {};
                return `**${index + 1}.** **Owner:** ${owner || "Unknown owner"}\n**Repo:** ${repo || "Unknown repo"}\n**Issue ID:** ${issue || "Unknown ID"}\n**Content:** ${content || "No content available"}`;
            })
            .join("\n\n");
    }
}