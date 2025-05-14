import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommitChunksDto {

    @ApiProperty({
        description: 'The content of the commit chunk',
        example: 'Fix typo in function name.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'The file name where the commit is located',
        example: 'src/utils/helper.js',
    })
    @IsString()
    fileName: string;

    @ApiProperty({
        description: 'The commit message associated with the commit',
        example: 'Refactor validation function to improve readability.',
    })
    @IsString()
    @IsNotEmpty()
    commitMessage: string;

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
        description: 'The SHA hash of the commit',
        example: 'f4a8d1e0b12d1d8a759f8f52b9d5ef0d8a4a2bce',
    })
    @IsString()
    @IsNotEmpty()
    sha: string;

    @ApiProperty({
        description: 'The author of the commit',
        example: 'john.doe',
    })
    @IsString()
    @IsNotEmpty()
    author: string;
}
