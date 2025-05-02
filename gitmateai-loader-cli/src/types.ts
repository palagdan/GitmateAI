
export interface Issue {
    content: string;
    type: IssueContentType;
    author: string;
    commentId: number;
    owner: string
    repo: string;
    issueNumber: number;
}

export interface Commit {
    content: string,
    fileName: string,
    commitMessage: string,
    owner: string,
    repo: string,
    sha: string,
    author: string
}

export interface PR {
    content: string;
    type: PRContentType
    author: string;
    commentId: number;
    owner: string
    repo: string;
    prNumber: number;
}


export enum IssueContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
}

export enum PRContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
    Changes = 'changes',
}
