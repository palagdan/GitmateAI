import {Context} from "probot";
import {LLMAgent} from "./llm-agent.js";


export class ConventionControllerAgent extends LLMAgent<Context, void>{


    handleEvent(context: Context): Promise<any> {
        return Promise.resolve(undefined);
    }

}