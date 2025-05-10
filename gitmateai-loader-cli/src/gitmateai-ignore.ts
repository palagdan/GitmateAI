import path from "path";
import fs from "fs";
import logger from "./logger.js";


export function loadGitmateAIInclude(): string[] {
    const includeFilePath = path.resolve(".gitmateai-include");
    if (!fs.existsSync(includeFilePath)) {
        logger.info(".gitmateai-include not found, proceeding without include rules.");
        return [];
    }

    const content = fs.readFileSync(includeFilePath, "utf-8");
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#"));
}


export function shouldInclude(filePath: string, includePatterns: string[]): boolean {
    return includePatterns.some(pattern =>
        filePath === pattern || filePath.endsWith(pattern) || filePath.match(new RegExp(pattern))
    );
}