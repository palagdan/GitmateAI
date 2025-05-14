import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchChunksDto {

    @ApiProperty({
        description: 'The content to search for in the chunks',
        example: 'function validateInput() {...}',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({
        description: 'The limit of results to return',
        example: 10,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;

    @ApiPropertyOptional({
        description: 'The specific fields to search in (e.g., ["content", "filePath"])',
        example: ['content', 'filePath'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    fields?: string[];
}
