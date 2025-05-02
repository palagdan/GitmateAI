

export interface PR {
    owner: string;
    repo: string;
    prNumber: number;
}

export interface PRComment extends PR{
    commentId: number | undefined;
}

export enum PRContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
    Changes = 'changes',
}

export interface PRChunk {
    content: string,
    type: PRContentType,
    author: string,
    commentId: number | undefined,
    owner: string,
    repo: string,
    prNumber: number | undefined,
}