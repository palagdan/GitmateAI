import {IsNotEmpty, IsString} from "class-validator";


export class ConventionDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    source: string;
}