import {IsNotEmpty, IsString} from "class-validator";


export class OwnerRepoDto {
    @IsString()
    @IsNotEmpty()
    owner: string;

    @IsString()
    @IsNotEmpty()
    repo: string;
}