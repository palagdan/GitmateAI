import {IssueDto} from "./issue.dto";
import {Transform} from "class-transformer";
import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";


export class IssueCommentDto extends IssueDto {

    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    commentId: number;
}