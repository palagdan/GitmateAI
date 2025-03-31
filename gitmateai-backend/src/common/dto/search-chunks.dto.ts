import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsPositive } from 'class-validator';

export class SearchChunksDto {

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