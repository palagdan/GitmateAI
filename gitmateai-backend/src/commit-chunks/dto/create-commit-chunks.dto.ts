import {IsNotEmpty, IsString} from "class-validator";

export class CreateCommitChunksDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    commitMessage: string;

    @IsString()
    @IsNotEmpty()
    owner: string;

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsString()
    @IsNotEmpty()
    sha: string;

    @IsString()
    @IsNotEmpty()
    author: string;

}