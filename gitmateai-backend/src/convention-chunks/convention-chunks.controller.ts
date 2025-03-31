import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {ConventionChunksService} from "./convention-chunks.service";
import {SearchConventionChunksDto} from "./dto/search-convention-chunks.dto";
import {ContentDto} from "../common/dto/content.dto";

@Controller('convention-chunks')
export class ConventionChunksController {

    constructor(private readonly conventionChunksService: ConventionChunksService) {}

    @Get()
    async getAll() {
        return await this.conventionChunksService.findAll();
    }

    @Delete()
    async deleteAll() {
        return await this.conventionChunksService.deleteAll();
    }

    @Post()
    async insert(@Body() contentDto: ContentDto){
        return await this.conventionChunksService.insert(contentDto);
    }

    @Post("search")
    async search(@Body() serchChunksDto: SearchConventionChunksDto){
        return await this.conventionChunksService.search(serchChunksDto);
    }
}
