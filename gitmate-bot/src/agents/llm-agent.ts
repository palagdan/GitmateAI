import {BaseAgent} from "./base-agent.js";

export abstract class LLMAgent<I, O> implements BaseAgent<I, O> {

    protected llmClient: any;
    protected promptTemplate: any;

    constructor(llmClient: any, promptTemplate: any) {
        this.llmClient = llmClient;
        this.promptTemplate = promptTemplate;
    }

    abstract handleEvent(event: I): Promise<O>;

    protected createPrompt(values: Record<string, string>): string {
        let prompt = this.promptTemplate;

        for (const [key, value] of Object.entries(values)) {
            prompt = prompt.replace(`{{${key}}}`, value);
        }

        return prompt;
    }
}