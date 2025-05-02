import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";;
import {PRChunksService} from "./pr-chunks.service";
import {PRDto} from "./dto/pr.dto";
import {PRCommentDto} from "./dto/pr-comment.dto";
import {CreatePRChunksDto} from "./dto/create-pr-chunks.dto";
import {SearchChunksDto} from "../common/dto/search-chunks.dto";

@Controller('pr-chunks')
export class PRChunksController {

    constructor(private readonly prChunkService: PRChunksService) {}

    @Get()
    async getAll() {
        return await this.prChunkService.findAll();
    }

    @Get(':owner/:repo/:prNumber')
    async getByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.findByOwnerRepoPR(prDto);
    }

    @Get(':owner/:repo/:prNumber/comments/:commentId')
    async getByOwnerRepoPRCommentId(@Param() prCommentDto: PRCommentDto) {
        return await this.prChunkService.findByOwnerRepoPRCommentId(prCommentDto);
    }

    @Get(':owner/:repo/:prNumber/title')
    async getTitleByOwnerRepoPR(@Param() prDto : PRDto) {
        return await this.prChunkService.findTitleByOwnerRepoPR(prDto);
    }

    @Get(':owner/:repo/:prNumber/description')
    async getDescriptionByOwnerRepoPR(@Param() pr: PRDto) {
        return await this.prChunkService.findDescriptionByOwnerRepoPR(pr);
    }

    @Delete(':owner/:repo/:prNumber')
    async deleteByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.deleteByOwnerRepoPR(prDto);
    }

    @Delete(':owner/:repo/:prNumber/comments/:commentId')
    async deleteCommentByOwnerRepoPRCommentId(@Param() prCommentDto: PRCommentDto) {
        return await this.prChunkService.deleteCommentByOwnerRepoPRCommentId(prCommentDto);
    }

    @Post()
    async insert(@Body() createPRChunksDto: CreatePRChunksDto) {
        return await this.prChunkService.insert(createPRChunksDto);
    }

    @Post("/search")
    async search(@Body() searchPRChunksDto: SearchChunksDto) {
        return await this.prChunkService.search(searchPRChunksDto);

    }

    @Put()
    async update(@Body() updatePRChunksDto: CreatePRChunksDto) {
        return await this.prChunkService.update(updatePRChunksDto);
    }
}