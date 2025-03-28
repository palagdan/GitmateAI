import {BaseAgent} from "./base.agent.js";

export abstract class LlmAgent<I, O> implements BaseAgent<I, O> {

    abstract handleEvent(event: I): Promise<O>;

    protected createPrompt(promptTemplate: string, values: Record<string, string>): string {

        let prompt = promptTemplate;

        for (const [key, value] of Object.entries(values)) {
            prompt = prompt.replace(`{{${key}}}`, value);
        }

        return prompt;
    }
}