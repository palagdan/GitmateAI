import {IsNotEmpty, IsString} from "class-validator";


export class ContentDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}