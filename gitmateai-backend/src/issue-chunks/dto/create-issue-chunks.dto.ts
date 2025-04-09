import {IsString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';
import {IssueContentType} from "../types";

export class CreateIssueChunksDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    type: IssueContentType;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    commentId: number;

    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    issueId: number;
}