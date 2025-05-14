import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { IssueChunksService } from './issue-chunks.service';
import { CreateIssueChunksDto } from './dto/create-issue-chunks.dto';
import { IssueDto } from './dto/issue.dto';
import { IssueCommentDto } from './dto/issue-comment.dto';
import { SearchIssueChunksDto } from './dto/search-issue-chunks.dto';

@ApiTags('Issue Chunks')
@Controller('issue-chunks')
export class IssueChunksController {
    constructor(private readonly issueChunkService: IssueChunksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all issue chunks' })
    @ApiResponse({ status: 200, description: 'Returns all issue chunks' })
    async getAll() {
        return await this.issueChunkService.findAll();
    }

    @Get(':owner/:repo/:issueNumber')
    @ApiOperation({ summary: 'Get issue chunks by owner, repo, and issue number' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Returns the issue chunk' })
    async getByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.findByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issueNumber/comments/:commentId')
    @ApiOperation({ summary: 'Get a specific issue comment chunk' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiParam({ name: 'commentId', type: Number })
    @ApiResponse({ status: 200, description: 'Returns the comment chunk' })
    async getByOwnerRepoIssueCommentId(@Param() commentDto: IssueCommentDto) {
        return this.issueChunkService.findByOwnerRepoIssueCommentId(commentDto);
    }

    @Get(':owner/:repo/:issueNumber/title')
    @ApiOperation({ summary: 'Get issue title chunk' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Returns the title chunk' })
    async getTitleByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findTitleByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issueNumber/description')
    @ApiOperation({ summary: 'Get issue description chunk' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Returns the description chunk' })
    async getDescriptionByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findDescriptionByOwnerRepoIssue(issue);
    }

    @Delete(':owner/:repo/:issueNumber')
    @ApiOperation({ summary: 'Delete all issue chunks by issue' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiResponse({ status: 200, description: 'Issue chunks deleted' })
    @ApiResponse({ status: 404, description: 'Issue chunks not found' })
    async deleteByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.deleteByOwnerRepoIssue(issue);
    }

    @Delete(':owner/:repo/:issueNumber/comments/:commentId')
    @ApiOperation({ summary: 'Delete a specific issue comment chunk' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'issueNumber', type: Number })
    @ApiParam({ name: 'commentId', type: Number })
    @ApiResponse({ status: 200, description: 'Comment chunk deleted' })
    async deleteCommentByOwnerRepoIssueCommentId(@Param() dto: IssueCommentDto) {
        return await this.issueChunkService.deleteCommentByOwnerRepoIssueCommentId(dto);
    }

    @Post()
    @ApiOperation({ summary: 'Insert issue data' })
    @ApiBody({ type: CreateIssueChunksDto })
    @ApiResponse({ status: 201, description: 'Issue chunks created' })
    async insert(@Body() createIssueChunksDto: CreateIssueChunksDto) {
        return await this.issueChunkService.insert(createIssueChunksDto);
    }

    @Post('search')
    @ApiOperation({ summary: 'Search similar issue chunks' })
    @ApiBody({ type: SearchIssueChunksDto })
    @ApiResponse({ status: 200, description: 'Search results' })
    async search(@Body() searchIssueChunksDto: SearchIssueChunksDto) {
        return await this.issueChunkService.search(searchIssueChunksDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update issue chunks' })
    @ApiBody({ type: CreateIssueChunksDto })
    @ApiResponse({ status: 200, description: 'Issue chunks updated' })
    async update(@Body() updateIssueChunksDto: CreateIssueChunksDto) {
        return await this.issueChunkService.update(updateIssueChunksDto);
    }
}
