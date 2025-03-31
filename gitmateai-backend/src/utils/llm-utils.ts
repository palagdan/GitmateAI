import {
    RecursiveCharacterTextSplitter,
    SupportedTextSplitterLanguage,
} from "@langchain/textsplitters";
import * as path from "node:path";

export const splitText = async (text: string, chunkSize = 512, chunkOverlap = 50): Promise<string[]> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });
    return await splitter.splitText(text);
}


const langMapper: { [key: string]: SupportedTextSplitterLanguage} = {
    // JavaScript and related
    ".js": "js",
    ".ts": "js",
    ".jsx": "js",
    ".tsx": "js",
    ".mjs": "js",

    // C++ and related
    ".cpp": "cpp",
    ".cxx": "cpp",
    ".cc": "cpp",
    ".c": "cpp",

    // Go
    ".go": "go",

    // Java
    ".java": "java",

    // PHP
    ".php": "php",

    // Protocol Buffers
    ".proto": "proto",

    // Python
    ".py": "python",

    // reStructuredText
    ".rst": "rst",

    // Ruby
    ".rb": "ruby",

    // Rust
    ".rs": "rust",

    // Scala
    ".scala": "scala",
    ".sc": "scala",

    // Swift
    ".swift": "swift",

    // Markdown
    ".md": "markdown",
    ".markdown": "markdown",

    // LaTeX
    ".tex": "latex",
    ".latex": "latex",

    // HTML
    ".html": "html",
    ".htm": "html",

    // Solidity
    ".sol": "sol",
};

export const splitCode = async(code: string, filepath: string,chunkSize = 512, chunkOverlap = 50): Promise<string[]> => {
    let splitter: RecursiveCharacterTextSplitter;
    const fileExtension = path.extname(filepath).toLowerCase();

    const lang = langMapper[fileExtension];

    if(lang){
        splitter = RecursiveCharacterTextSplitter.fromLanguage(lang, {
            chunkSize,
            chunkOverlap,
        })
    }else{
        splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
        });
    }

    return await splitter.splitText(code);

}