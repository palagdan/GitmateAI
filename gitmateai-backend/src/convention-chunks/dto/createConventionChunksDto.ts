import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateConventionChunksDto {

    @ApiProperty({
        description: 'The content of the convention chunk',
        example: 'This is a convention chunk content example.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'The source of the convention chunk (e.g., API, document)',
        example: 'API',
    })
    @IsString()
    @IsNotEmpty()
    source: string;
}
