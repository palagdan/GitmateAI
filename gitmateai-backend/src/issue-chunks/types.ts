import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";


export interface Issue {
    owner: string;
    repo: string;
    issueId: number;
}

export interface IssueComment extends Issue {
    commentId: number;
}


export enum IssueContentType {
    Title = 'title',
    Description = 'description',
    Comment = 'comment',
}

export interface IssueChunk {
    content: string;
    type: IssueContentType;
    author: string;
    commentId: number;
    owner: string
    repo: string;
    issueId: number;
}