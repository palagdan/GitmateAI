import {IsString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';

export class CreateIssueChunksDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    issue: number;
}