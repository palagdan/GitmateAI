import {IsString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';
import {Transform} from "class-transformer";

export class IssueDto {

    @IsString()
    @IsNotEmpty()
    owner: string

    @IsString()
    @IsNotEmpty()
    repo: string;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    issueId: number;
}