import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PRContentType } from "../types";

export class CreatePRChunksDto {

    @ApiProperty({
        description: 'The content of the pull request chunk',
        example: 'Refactor code to improve performance.',
    })
    @IsString()
    content: string;

    @ApiProperty({
        description: 'The type of the pull request content (e.g., description, comment)',
        example: 'description',
    })
    @IsString()
    @IsNotEmpty()
    type: PRContentType;

    @ApiProperty({
        description: 'The author of the pull request chunk',
        example: 'john.doe',
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({
        description: 'The comment ID associated with the pull request (optional)',
        example: 123,
    })
    @IsOptional()
    @IsNumber()
    commentId?: number;

    @ApiProperty({
        description: 'The owner of the repository',
        example: 'octocat',
    })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({
        description: 'The repository name',
        example: 'hello-world',
    })
    @IsString()
    @IsNotEmpty()
    repo: string;

    @ApiProperty({
        description: 'The pull request number',
        example: 42,
    })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    prNumber: number;
}
