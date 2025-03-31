import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";


export const splitText = async (text: string, chunkSize = 512, chunkOverlap = 50): Promise<string[]> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });
    return splitter.splitText(text);
}