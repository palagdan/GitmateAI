
export interface Commit {
    owner: string;
    repo: string;
    sha: string;
}

export interface CommitChunk {
    content: string,
    fileName: string,
    commitMessage: string,
    owner: string,
    repo: string,
    sha: string,
    author: string
}
