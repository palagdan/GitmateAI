import {IsNotEmpty, IsString} from "class-validator";


export class CommitDto {
    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @IsString()
    @IsNotEmpty()
    sha: string;
}