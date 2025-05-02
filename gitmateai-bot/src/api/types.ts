export interface Content {
    content: string,
}

export interface CreateRepoChunks {
    content: string,
    owner: string,
    repo: string,
}
export enum IssueContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
}

export interface CreateIssueChunks extends CreateRepoChunks {
    issueNumber: number
    type: IssueContentType,
    author: string,
    commentId?: number ,
}


export interface CreateCodeChunks extends CreateRepoChunks {
    filePath: string
}

export interface Issue {
    owner: string;
    repo: string;
    issueNumber: number;
}

export interface IssueComment extends Issue {
    commentId: number | undefined;
}

export interface Commit {
    owner: string;
    repo: string;
    sha: string;
}

export interface CreateCommitChunks extends CreateRepoChunks {
    sha: string,
    author: string,
    fileName: string,
    commitMessage: string,
}

export interface PR {
    owner: string;
    repo: string;
    prNumber: number;
}

export interface PRComment extends PR {
    commentId: number | undefined;
}

export interface CreatePRChunks extends CreateRepoChunks {
    prNumber: number
    type: PRContentType,
    author: string,
    commentId?: number ,
}

export enum PRContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
    Changes = 'changes',
}

