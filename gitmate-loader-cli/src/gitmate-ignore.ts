import path from "path";
import fs from "fs";


export function loadGitmateIgnore(): string[] {
    const ignoreFilePath = path.resolve(".gitmateignore");
    if (!fs.existsSync(ignoreFilePath)) {
        console.log(".gitmateignore not found, proceeding without ignore rules.");
        return [];
    }

    const content = fs.readFileSync(ignoreFilePath, "utf-8");
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line && !line.startsWith("#"));
}


export function shouldIgnore(filePath: string, ignorePatterns: string[]): boolean {
    return ignorePatterns.some(pattern =>
        filePath === pattern || filePath.endsWith(pattern) || filePath.match(new RegExp(pattern))
    );
}