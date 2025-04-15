
import {Transform} from "class-transformer";
import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";
import {PRDto} from "./pr.dto";


export class PRCommentDto extends PRDto {

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    commentId: number;

}