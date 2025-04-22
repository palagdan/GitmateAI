import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {ConventionChunksService} from "./convention-chunks.service";
import {SearchConventionChunksDto} from "./dto/search-convention-chunks.dto";
import {ConventionDto} from "./dto/convention.dto";

@Controller('convention-chunks')
export class ConventionChunksController {

    constructor(private readonly conventionChunksService: ConventionChunksService) {}

    @Get()
    async getAll() {
        return await this.conventionChunksService.findAll();
    }

    @Get(':source')
    async getBySource(@Param() source: string) {
        return await this.conventionChunksService.findBySource(source);
    }

    @Delete(':source')
    async deleteBySource(@Param() source: string) {
        return await this.conventionChunksService.deleteBySource(source);
    }

    @Delete()
    async deleteAll() {
        return await this.conventionChunksService.deleteAll();
    }

    @Post()
    async insert(@Body() contentDto: ConventionDto){
        return await this.conventionChunksService.insert(contentDto);
    }

    @Post("search")
    async search(@Body() serchChunksDto: SearchConventionChunksDto){
        return await this.conventionChunksService.search(serchChunksDto);
    }
}
