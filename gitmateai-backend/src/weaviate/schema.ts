import {vectorizer} from "weaviate-client";

export const createIssueChunkSchema = (config: {
    ollamaUrl: string;
    ollamaEmbeddingModel: string;
}) => ({
    name: 'IssueChunks',
    properties: [
        { name: 'content', dataType: 'text' },
        { name: 'type', dataType: 'text', skipVectorization: true },
        { name: 'owner', dataType: 'text', skipVectorization: true },
        { name: 'repo', dataType: 'text', skipVectorization: true },
        { name: 'issueNumber', dataType: 'int', skipVectorization: true },
        { name: 'author', dataType: 'text', skipVectorization: true },
        { name: 'commentId', dataType: 'int', skipVectorization: true },
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: config.ollamaUrl,
        model: config.ollamaEmbeddingModel,
    }),
});

export const createCodeChunksSchema = (config: {
    ollamaUrl: string;
    ollamaEmbeddingModel: string;
}) => ({
    name: 'CodeChunks',
    properties: [
        { name: 'content', dataType: 'text' },
        { name: 'owner', dataType: 'text', skipVectorization: true },
        { name: 'repo', dataType: 'text', skipVectorization: true },
        { name: 'filePath', dataType: 'text', skipVectorization: true },
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: config.ollamaUrl,
        model: config.ollamaEmbeddingModel,
    }),
});

export const createConventionChunkSchema = (config: {
    ollamaUrl: string;
    ollamaEmbeddingModel: string;
}) => ({
    name: 'ConventionChunks',
    properties: [
        { name: 'content', dataType: 'text' },
        { name: 'source', dataType: 'text', skipVectorization: true },
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: config.ollamaUrl,
        model: config.ollamaEmbeddingModel,
    }),
});

export const createCommitChunksSchema = (config: {
    ollamaUrl: string;
    ollamaEmbeddingModel: string;
}) => ({
    name: 'CommitChunks',
    properties: [
        { name: 'content', dataType: 'text' },
        { name: 'fileName', dataType: 'text', skipVectorization: true },
        { name: 'commitMessage', dataType: 'text'},
        { name: 'owner', dataType: 'text', skipVectorization: true },
        { name: 'repo', dataType: 'text', skipVectorization: true },
        { name: 'sha', dataType: 'text', skipVectorization: true },
        { name: 'author', dataType: 'text', skipVectorization: true },
    ],
    vectorizers: vectorizer.text2VecOllama({
        apiEndpoint: config.ollamaUrl,
        model: config.ollamaEmbeddingModel,
    })
});
