import {BaseAgent} from "./base.agent.js";
import logger from "../logger.js";

export abstract class LlmAgent<I, O> implements BaseAgent<I, O> {

    protected agentLogger = logger.child({ agent: this.constructor.name });

    abstract handleEvent(event: I): Promise<O>;

    protected createPrompt(promptTemplate: string, values: Record<string, string>): string {
        let prompt = promptTemplate;
        const unmatchedKeys = new Set(Object.keys(values));

        for (const [key, value] of Object.entries(values)) {
            const placeholder = `{{${key}}}`;
            if (prompt.includes(placeholder)) {
                prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
                unmatchedKeys.delete(key);
            }
        }

        if (unmatchedKeys.size > 0) {
            throw new Error(`The following keys were not found in the prompt template: ${Array.from(unmatchedKeys).join(', ')}`);
        }

        return prompt;
    }
}