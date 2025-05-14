import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueContentType } from "../types";

export class CreateIssueChunksDto {
    @ApiProperty({
        description: 'The raw content of the issue or comment chunk',
        example: 'This PR addresses the issue with login validation.'
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'The type of the issue content, e.g., title, description, comment',
        enum: IssueContentType,
        example: 'comment'
    })
    @IsString()
    @IsNotEmpty()
    type: IssueContentType;

    @ApiProperty({
        description: 'The GitHub username of the author',
        example: 'octocat'
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiPropertyOptional({
        description: 'The GitHub comment ID if the content is a comment',
        example: 987654
    })
    @IsOptional()
    @IsNumber({}, { message: 'commentId must be a number or null' })
    commentId?: number | undefined;

    @ApiProperty({
        description: 'The owner of the GitHub repository',
        example: 'octocat'
    })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({
        description: 'The name of the GitHub repository',
        example: 'hello-world'
    })
    @IsString()
    @IsNotEmpty()
    repo: string;

    @ApiProperty({
        description: 'The issue number in the repository',
        example: 42
    })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    issueNumber: number;
}
