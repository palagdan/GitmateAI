import {IsString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';

export class CreateCodeChunksDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsString()
    @IsNotEmpty()
    filePath: string
}