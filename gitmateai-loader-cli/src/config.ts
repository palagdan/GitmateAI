import path from "path";
import fs from "fs";
import logger from "./logger.js";


const loadKnowdgeBases =  ()  => {
    const knowledgeBasesPath = path.resolve("knowledge-bases.json");

    if (!fs.existsSync(knowledgeBasesPath)) {
        logger.info("knowledge-bases.json not found, proceeding without knowledge bases.");
        return [];
    }

    const fileContents =  fs.readFileSync(knowledgeBasesPath, 'utf-8');
    const parsed = JSON.parse(fileContents);
    return parsed.knowledge_bases;
}


export const knowledgeBases = loadKnowdgeBases();