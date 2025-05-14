import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCodeChunksDto {
    @ApiProperty({
        description: 'The content of the code chunk',
        example: 'This function validates user input.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'The owner of the repository',
        example: 'octocat',
    })
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({
        description: 'The name of the repository',
        example: 'hello-world',
    })
    @IsString()
    @IsNotEmpty()
    repo: string;

    @ApiProperty({
        description: 'The file path where the code chunk resides',
        example: 'src/utils/validation.js',
    })
    @IsString()
    @IsNotEmpty()
    filePath: string;
}
