import {IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional} from 'class-validator';
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


    @IsOptional()
    @IsNumber({}, { message: 'commentId must be a number or null' })
    commentId?: number | undefined;

    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    issueNumber: number;
}