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

