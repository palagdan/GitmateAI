import {Context} from "probot";

export interface GitHubService {
    getIssue(context: Context): Promise<any>;
    listComments(context: Context): Promise<any[]>;
    createComment(context: Context, body: string): Promise<void>;
    listLabelsForRepo(context: Context): any;
    addLabels(context: Context, labels: string[]): Promise<void>;
}

export class OctokitGitHubService implements GitHubService {
    async getIssue(context: Context) {
        const { owner, repo, issue_number } = context.issue();
        return context.octokit.issues.get({ owner, repo, issue_number });
    }

    async listComments(context: Context) {
        const { owner, repo, issue_number } = context.issue();
        return context.octokit.paginate(context.octokit.rest.issues.listComments, {
            owner,
            repo,
            issue_number,
        });
    }

    async createComment(context: Context, body: string) {
        const { owner, repo, issue_number } = context.issue();
        await context.octokit.issues.createComment({ owner, repo, issue_number, body });
    }

    async listLabelsForRepo(context: Context) {
        const { owner, repo } = context.issue();
        return context.octokit.issues.listLabelsForRepo({ owner, repo });
    }

    async addLabels(context: Context, labels: string[]) {
        const { owner, repo, issue_number } = context.issue();
        await context.octokit.issues.addLabels({ owner, repo, issue_number, labels });
    }
}