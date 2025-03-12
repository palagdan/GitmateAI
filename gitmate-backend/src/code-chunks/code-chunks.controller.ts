import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {CodeChunksService} from "./code-chunks.service";
import {CreateCodeChunksDto} from "./dto/create-code-chunks.dto";
import {SearchCodeChunksDto} from "./dto/search-code-chunks.dto";


@Controller('code-chunks')
export class CodeChunksController {

    constructor(private readonly codeChunksService: CodeChunksService) {}

    @Get()
    async getAll() {
        return await this.codeChunksService.findAll();
    }

    @Get(':owner')
    async getByOwner(
        @Param('owner') owner: string,
    ) {
        return await this.codeChunksService.findByOwner(
            owner
        );
    }

    @Get(':owner/:repo')
    async getByOwnerRepo(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
    ) {
        return await this.codeChunksService.findByOwnerRepo(
            owner,
            repo
        );
    }


    @Get(':owner/:repo')
    async getByOwnerRepoFilePath(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
        @Query('path') filePath: string,
    ) {
        const decodedFilePath = decodeURIComponent(filePath);
        return await this.codeChunksService.findByOwnerRepoFilePath(
            owner,
            repo,
            decodedFilePath,
        );
    }


    @Delete(':owner')
    async deleteByOwner(
        @Param('owner') owner: string,
    ) {
        return await this.codeChunksService.deleteByOwner(
            owner,
        );
    }


    @Delete(':owner/:repo')
    async deleteByOwnerRepo(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
    ) {
        return await this.codeChunksService.deleteByOwnerRepo(
            owner,
            repo,
        );
    }


    @Delete(':owner/:repo')
    async deleteByOwnerRepoFilePath(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
        @Query('path') filePath: string,
    ) {
        const decodedFilePath = decodeURIComponent(filePath);
        return await this.codeChunksService.deleteByOwnerRepoFilePath(
            owner,
            repo,
            decodedFilePath,
        );
    }

    @Post()
    async insert(@Body() createCodeChunksDto: CreateCodeChunksDto){
        return await this.codeChunksService.insert(createCodeChunksDto);
    }

    @Post("search")
    async search(@Body() searchChunksDto: SearchCodeChunksDto){
        return await this.codeChunksService.search(searchChunksDto);
    }

}
