import api from "./api.js";
import {CreateCodeChunks, CreateIssueChunks, SearchChunks, SearchCodeChunks} from "./types.js";




const gitmate = {
    issueChunks: {
        async getAll() {
            return await api.get("/issue-chunks");
        },

        async getByOwnerRepoIssue (owner: string, repo: string, issue: number)  {
            return await api.get(`/issue-chunks/${owner}/${repo}/${issue}`);
        },

        async deleteByOwnerRepoIssue(owner: string, repo: string, issue: number){
            return await api.delete(`/issue-chunks/${owner}/${repo}/${issue}`);
        },

        async insert(createIssueChunks: CreateIssueChunks){
            return await api.post('issue-chunks', createIssueChunks);
        },

        async search(searchChunks: SearchChunks) {
            return await api.post('issue-chunks/search', searchChunks);
        }

    },

    codeChunks: {
        async getAll() {
            return await api.get(`/code-chunks`);
        },

        async getByOwner(owner: string) {
            return await api.get(`/code-chunks/${owner}`);
        },

        async getByOwnerRepo(owner: string, repo: string) {
            return await api.get(`/code-chunks/${owner}/${repo}`);
        },

        async getByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
            return await api.get(`/code-chunks/${owner}/${repo}?path=${filePath}`);
        },

        async deleteByOwner(owner: string) {
            return await api.delete(`/code-chunks/${owner}`);
        },

        async deleteByOwnerRepo(owner: string, repo: string) {
            return await api.delete(`/code-chunks/${owner}/${repo}`);
        },

        async deleteByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
            return await api.delete(`/code-chunks/${owner}/${repo}?path=${filePath}`);
        },

        async insert(createCodeChunks: CreateCodeChunks){
            return await api.post(`/code-chunks/`, createCodeChunks);
        },

        async search(searchCodeChunks: SearchCodeChunks){
            return await api.post('/code-chunks/search', searchCodeChunks);
        }
    }
}

export default gitmate;