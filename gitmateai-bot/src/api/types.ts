export interface Content {
    content: string,
}

export interface CreateRepoChunks {
    content: string,
    owner: string,
    repo: string,
}

export interface CreateIssueChunks extends CreateRepoChunks {
    issue: number
}


export interface CreateCodeChunks extends CreateRepoChunks {
    filePath: string
}
