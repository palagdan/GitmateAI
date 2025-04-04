import api from "./api.js";
import {Content, CreateCodeChunks, CreateIssueChunks} from "./types.js";
import {SearchQuery} from "../agents/common/types.js";




const gitmateai = {
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

        async search(searchChunks: SearchQuery) {
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

        async search(searchCodeChunks: SearchQuery){
            return await api.post('/code-chunks/search', searchCodeChunks);
        }
    },

    conventionChunks: {
        async getAll() {
            return await api.get(`/convention-chunks`);
        },

        async deleteAll() {
            return await api.delete(`/convention-chunks`);
        },

        async insert(createConventionChunks: Content){
            return await api.post(`/convention-chunks`, createConventionChunks);
        },

        async search(searchConvention: SearchQuery) {
            return await api.post(`/convention-chunks/search`, searchConvention);
        }
    }
}

export default gitmateai;