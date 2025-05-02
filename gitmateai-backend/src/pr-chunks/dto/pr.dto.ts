import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";
import {Transform} from "class-transformer";


export class PRDto {

    @IsString()
    @IsNotEmpty()
    owner: string;

    @IsString()
    @IsNotEmpty()
    repo: string;

    @Transform(({value}) => parseInt(value, 10))
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    prNumber: number;

}