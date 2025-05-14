import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { PRChunksService } from './pr-chunks.service';
import { PRDto } from './dto/pr.dto';
import { PRCommentDto } from './dto/pr-comment.dto';
import { CreatePRChunksDto } from './dto/create-pr-chunks.dto';
import { SearchChunksDto } from '../common/dto/search-chunks.dto';

@ApiTags('PR Chunks')
@Controller('pr-chunks')
export class PRChunksController {
    constructor(private readonly prChunkService: PRChunksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all PR chunks' })
    @ApiResponse({ status: 200, description: 'List of all PR chunks' })
    async getAll() {
        return await this.prChunkService.findAll();
    }

    @Get(':owner/:repo/:prNumber')
    @ApiOperation({ summary: 'Get PR chunks by owner, repo, and PR number' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Chunks for the specified PR' })
    async getByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.findByOwnerRepoPR(prDto);
    }

    @Get(':owner/:repo/:prNumber/comments/:commentId')
    @ApiOperation({ summary: 'Get PR comment chunk by comment ID' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiParam({ name: 'commentId', type: String })
    @ApiResponse({ status: 200, description: 'Comment chunk for the specified PR comment ID' })
    async getByOwnerRepoPRCommentId(@Param() prCommentDto: PRCommentDto) {
        return await this.prChunkService.findByOwnerRepoPRCommentId(prCommentDto);
    }

    @Get(':owner/:repo/:prNumber/title')
    @ApiOperation({ summary: 'Get title chunk of PR' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Title chunk for the specified PR' })
    async getTitleByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.findTitleByOwnerRepoPR(prDto);
    }

    @Get(':owner/:repo/:prNumber/description')
    @ApiOperation({ summary: 'Get description chunk of PR' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Description chunk for the specified PR' })
    async getDescriptionByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.findDescriptionByOwnerRepoPR(prDto);
    }

    @Delete(':owner/:repo/:prNumber')
    @ApiOperation({ summary: 'Delete PR chunks by owner, repo, and PR number' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Deleted PR chunks successfully' })
    async deleteByOwnerRepoPR(@Param() prDto: PRDto) {
        return await this.prChunkService.deleteByOwnerRepoPR(prDto);
    }

    @Delete(':owner/:repo/:prNumber/comments/:commentId')
    @ApiOperation({ summary: 'Delete PR comment chunk by comment ID' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'prNumber', type: Number })
    @ApiParam({ name: 'commentId', type: String })
    @ApiResponse({ status: 200, description: 'Deleted PR comment chunk successfully' })
    async deleteCommentByOwnerRepoPRCommentId(@Param() prCommentDto: PRCommentDto) {
        return await this.prChunkService.deleteCommentByOwnerRepoPRCommentId(prCommentDto);
    }

    @Post()
    @ApiOperation({ summary: 'Insert PR chunks' })
    @ApiBody({ type: CreatePRChunksDto })
    @ApiResponse({ status: 201, description: 'PR chunks inserted successfully' })
    async insert(@Body() createPRChunksDto: CreatePRChunksDto) {
        return await this.prChunkService.insert(createPRChunksDto);
    }

    @Post('/search')
    @ApiOperation({ summary: 'Search PR chunks' })
    @ApiBody({ type: SearchChunksDto })
    @ApiResponse({ status: 200, description: 'Search results for PR chunks' })
    async search(@Body() searchPRChunksDto: SearchChunksDto) {
        return await this.prChunkService.search(searchPRChunksDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update PR chunks' })
    @ApiBody({ type: CreatePRChunksDto })
    @ApiResponse({ status: 200, description: 'PR chunks updated successfully' })
    async update(@Body() updatePRChunksDto: CreatePRChunksDto) {
        return await this.prChunkService.update(updatePRChunksDto);
    }
}
