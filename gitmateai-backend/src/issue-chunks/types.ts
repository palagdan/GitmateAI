import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";


export interface Issue {
    owner: string;
    repo: string;
    issueNumber: number;
}

export interface IssueComment extends Issue {
    commentId: number | undefined;
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
    commentId: number | undefined;
    owner: string
    repo: string;
    issueNumber: number;
}