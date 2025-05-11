import {knowledgeBases} from "./config.js";


export const isKnowledgeBase = (owner: string, repo: string) => {
    return knowledgeBases.some((kb) => {
        return kb.owner.toLowerCase() === owner.toLowerCase() && kb.repo.toLowerCase() === repo.toLowerCase();
    })
}

export const isMarkdownFile = (filePath: string) => {
    const markdownExtensions = ['.md', '.markdown'];
    return markdownExtensions.some((ext) => filePath.endsWith(ext));
}