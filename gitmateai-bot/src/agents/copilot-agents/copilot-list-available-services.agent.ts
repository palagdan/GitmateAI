import {LLMAgent} from "../LLMAgent.js";
import {CopilotAgentInput} from "./types.js";
import {availableCopilotServicesToString} from "./copilot-available-services.js";
import {createTextEvent} from "@copilot-extensions/preview-sdk";
import {getErrorMsg} from "../../messages/messages.js";


class CopilotListAvailableServicesAgent extends LLMAgent<CopilotAgentInput, void> {
    async handleEvent(input: CopilotAgentInput): Promise<void> {
        try {
            const {writeFunc} = input;
            writeFunc(createTextEvent(`## CopilotListAvailableServicesAgent Report 🤖` + "\n\n"));
            writeFunc(createTextEvent(`### Here are the available services:` + "\n\n"));
            writeFunc(createTextEvent(`${availableCopilotServicesToString()}`.trim()));
        }catch (error){
            input.writeFunc(createTextEvent(getErrorMsg(this.constructor.name, error)));
        }
    }
}

export default CopilotListAvailableServicesAgent;