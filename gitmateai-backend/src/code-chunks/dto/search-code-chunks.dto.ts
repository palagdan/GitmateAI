import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class SearchCodeChunksDto {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsArray()
    fields?: string[];
}