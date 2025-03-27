import OpenAI from "openai";


const llmClient = new OpenAI({apiKey: process.env.LLM_API_KEY});
export default llmClient;