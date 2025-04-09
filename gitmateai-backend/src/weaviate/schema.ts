import {vectorizer} from "weaviate-client";

export const IssueChunkSchema =  {
    name: "IssueChunks",
    properties: [
        { "name": "content", "dataType": "text"},
        { "name": "type", "dataType": "text", "skipVectorization": true},
        { "name": "owner", "dataType": "text",  "skipVectorization": true},
        { "name": "repo", "dataType": "text",  "skipVectorization": true},
        { "name": "issueId", "dataType": "int", "skipVectorization": true },
        { "name": "author", "dataType": "text", "skipVectorization": true},
        { "name": "commentId", "dataType": "int", "skipVectorization": true},
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: process.env.OLLAMA_URL || 'http://ollama:11434',
        model: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    })
};

export const CodeChunksSchema = {
    name: "CodeChunks",
    properties: [
        { "name": "content", "dataType": "text"},
        { "name": "owner", "dataType": "text", "skipVectorization": true},
        { "name": "repo", "dataType": "text", "skipVectorization": true},
        { "name": "filePath", "dataType": "text", "skipVectorization": true},
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: process.env.OLLAMA_URL || 'http://ollama:11434',
        model: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    })
}

export const ConventionChunkSchema = {
    name: "ConventionChunks",
    properties: [
        { "name": "content", "dataType": "text"},
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: process.env.OLLAMA_URL || 'http://ollama:11434',
        model: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    })
}

export default [IssueChunkSchema, CodeChunksSchema, ConventionChunkSchema];

