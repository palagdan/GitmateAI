import {vectorizer} from "weaviate-client";

export const IssueChunkSchema =  {
    name: "IssueChunks",
    properties: [
        { "name": "content", "dataType": "text"},
        { "name": "owner", "dataType": "text",  "skipVectorization": true},
        { "name": "repo", "dataType": "text",  "skipVectorization": true},
        { "name": "issue", "dataType": "int", "skipVectorization": true }
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: 'http://host.docker.internal:11434',
        model: 'nomic-embed-text',
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
        apiEndpoint: 'http://host.docker.internal:11434',
        model: 'nomic-embed-text',
    })
}

export default [IssueChunkSchema, CodeChunksSchema];

