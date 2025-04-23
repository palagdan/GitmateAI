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

export const helpMessage = load("HelpMessage.md");

export const issueCommandsButton = replacePrefix(load("IssueCommandsButton.md"), process.env.PREFIX);

export const prCommandsButton = replacePrefix(load("PRCommandsButton.md"), process.env.PREFIX);

export const prompts = JSON.parse(load("prompts.json"));



