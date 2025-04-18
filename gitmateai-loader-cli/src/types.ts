
export interface Issue {
    content: string;
    type: string;
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