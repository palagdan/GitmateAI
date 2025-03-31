import path from "path";
import fs from "fs";

const __dirname = new URL('.', import.meta.url).pathname;

const load = (fn) => {
    const configPath = path.join(__dirname, fn);
    return fs.readFileSync(configPath, 'utf-8');
}

export const  helpMessage = load("HelpMessage.md");

export const prompts = JSON.parse(load("prompts.json"));



