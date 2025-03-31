
export interface CreateRepoChunks {
    content: string,
    owner: string,
    repo: string,
}

export interface CreateIssueChunks extends CreateRepoChunks {
    issue: number
}

export interface SearchChunks {
    content: string,
    limit?: number,
    fields?: string[];
}

export interface CreateCodeChunks extends CreateRepoChunks {
    filePath: string
}

export interface SearchCodeChunks extends SearchChunks{
    filePath: string,
}