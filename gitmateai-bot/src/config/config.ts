import path from "path";
import fs from "fs";

const __dirname = new URL('.', import.meta.url).pathname;

const load = (fn) => {
    const configPath = path.join(__dirname, fn);
    return fs.readFileSync(configPath, 'utf-8');
}

const replacePrefix = (button: string, prefix: string): string => {
    return button.replaceAll("[prefix]", prefix);
}

export const helpMessage = replacePrefix(load("HelpMessage.md"), process.env.PREFIX);

export const commandsButton = load("CommandsButton.md");

export const prompts = JSON.parse(load("prompts.json"));



