import { IsOptional, IsString, IsArray, IsNumber, IsPositive, IsNotEmpty, validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {SearchChunksDto} from "../../common/dto/search-chunks.dto";

class ExcludeFilter {
    @IsOptional()
    @IsString({ each: true })
    @Type(() => String)
    owners?: string | string[];

    @IsOptional()
    @IsString({ each: true })
    @Type(() => String)
    repos?: string | string[];

    @IsOptional()
    @IsNumber({}, { each: true })
    @Type(() => Number)
    issueNumbers?: number | number[];

}

export class SearchIssueChunksDto extends SearchChunksDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => ExcludeFilter)
    exclude?: ExcludeFilter;
}