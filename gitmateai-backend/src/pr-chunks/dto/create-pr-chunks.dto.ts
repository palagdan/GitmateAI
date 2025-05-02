import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import {PRContentType} from "../types";


export class CreatePRChunksDto {

    @IsString()
    content: string;

    @IsString()
    @IsNotEmpty()
    type: PRContentType

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsOptional()
    @IsNumber()
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
    prNumber: number;

}