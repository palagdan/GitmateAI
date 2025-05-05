import api from "./api.js";
import {
    Commit,
    Content,
    CreateCodeChunks,
    CreateCommitChunks,
    CreateIssueChunks, CreatePRChunks,
    Issue,
    IssueComment, PR, PRComment
} from "./types.js";
import {SearchIssueQuery, SearchQuery} from "../agents/common/types.js";


const gitmateai = {
    issueChunks: {
        async getAll() {
            return await api.get("/issue-chunks");
        },

        async getByOwnerRepoIssue (issue: Issue)  {
            return await api.get(`/issue-chunks/${issue.owner}/${issue.repo}/${issue.issueNumber}`);
        },

        async deleteByOwnerRepoIssue(issue: Issue){
            return await api.delete(`/issue-chunks/${issue.owner}/${issue.repo}/${issue.issueNumber}`);
        },

        async deleteCommentByOwnerRepoIssueCommentId(issueComment: IssueComment){
            return await api.delete(`/issue-chunks/${issueComment.owner}/${issueComment.repo}/${issueComment.issueNumber}/comments/${issueComment.commentId}`);
        },

        async insert(createIssueChunks: CreateIssueChunks){
            return await api.post('issue-chunks', createIssueChunks);
        },

        async search(searchChunks: SearchIssueQuery) {
            return await api.post('issue-chunks/search', searchChunks);
        },

        async update(updateIssueChunks: CreateIssueChunks){
            return await api.put('issue-chunks', updateIssueChunks);
        },

    },

    prChunks: {
        async getAll() {
            return await api.get("/pr-chunks");
        },

        async getByOwnerRepoIssue (pr: PR)  {
            return await api.get(`/pr-chunks/${pr.prNumber}/${pr.prNumber}/${pr.prNumber}`);
        },

        async deleteByOwnerRepoIssue(pr: PR){
            return await api.delete(`/pr-chunks/${pr.owner}/${pr.repo}/${pr.prNumber}`);
        },

        async deleteCommentByOwnerRepoIssueCommentId(prComment: PRComment){
            return await api.delete(`/pr-chunks/${prComment.owner}/${prComment.repo}/${prComment.prNumber}/comments/${prComment.commentId}`);
        },

        async insert(createPRChunks: CreatePRChunks){
            return await api.post('pr-chunks', createPRChunks);
        },

        async search(searchChunks: SearchQuery) {
            return await api.post('pr-chunks/search', searchChunks);
        },

        async update(updatePRChunks: CreatePRChunks){
            return await api.put('pr-chunks', updatePRChunks);
        },
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
    },

    commitChunks: {
        async getAll() {
            return await api.get(`/commit-chunks`);
        },

        async getByOwnerRepoSha(commit: Commit){
            return await api.get(`/commit-chunks/${commit.owner}/${commit.repo}/${commit.sha}`);
        },

        async getByOwnerRepo(owner: string, repo: string) {
            return await api.get(`/commit-chunks/${owner}/${repo}`);
        },

        async deleteByOwnerRepoSha(commit: Commit){
            return await api.delete(`/commit-chunks/${commit.owner}/${commit.repo}/${commit.sha}`);
        },

        async insert(createCommitChunks: CreateCommitChunks){
            return await api.post(`/commit-chunks`, createCommitChunks);
        },

        async update(updateCommitChunks: CreateCommitChunks){
            return await api.put(`/commit-chunks`, updateCommitChunks);
        },

        async search(searchCommitChunks: SearchQuery){
            return await api.post(`/commit-chunks/search`, searchCommitChunks);
        }
    }
}

export default gitmateai;