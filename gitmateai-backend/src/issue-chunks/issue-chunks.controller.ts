import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import {IssueChunksService} from "./issue-chunks.service";
import {CreateIssueChunksDto} from "./dto/create-issue-chunks.dto";
import {IssueDto} from "./dto/issue.dto";
import {SearchChunksDto} from "../common/dto/search-chunks.dto";
import {ApiBody, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {IssueCommentDto} from "./dto/issue-comment.dto";


@Controller('issue-chunks')
export class IssueChunksController {
    constructor(private readonly issueChunkService: IssueChunksService) {}

    @ApiOperation({ summary: 'Get all issue chunks' })
    @ApiResponse({ status: 200, description: 'Returns all issue chunks' })
    @Get()
    async getAll() {
        return await this.issueChunkService.findAll();
    }

    @ApiOperation({ summary: 'Get issue chunks by owner, repo, and issue number' })
    @ApiParam({ name: 'owner', type: 'string', description: 'Repository owner' })
    @ApiParam({ name: 'repo', type: 'string', description: 'Repository name' })
    @ApiParam({ name: 'issue', type: 'number', description: 'Issue number' })
    @ApiResponse({ status: 200, description: 'Returns the issue chunk' })
    @ApiResponse({ status: 404, description: 'Issue chunk not found' })
    @Get(':owner/:repo/:issue')
    async getByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.findByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issue/:commentId')
    async getByOwnerRepoIssueCommentId(@Param() issue: IssueCommentDto) {
        return this.issueChunkService.findByOwnerRepoIssueCommentId(issue);
    }

    @Get(':owner/:repo/:issue/title')
    async getTitleByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findTitleByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issue/description')
    async getDescriptionByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findDescriptionByOwnerRepoIssue(issue);
    }

    @ApiOperation({ summary: 'Delete all issue chunks by owner, repo, and issue number' })
    @ApiParam({ name: 'owner', type: 'string', description: 'Repository owner' })
    @ApiParam({ name: 'repo', type: 'string', description: 'Repository name' })
    @ApiParam({ name: 'issue', type: 'number', description: 'Issue number' })
    @ApiResponse({ status: 200, description: 'Issue chunk deleted' })
    @ApiResponse({ status: 404, description: 'Issue chunk not found' })
    @Delete(':owner/:repo/:issue')
    async deleteByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.deleteByOwnerRepoIssue(issue);
    }

    @ApiOperation({ summary: 'Insert a new issue chunks' })
    @ApiBody({ type: CreateIssueChunksDto, description: 'Issue chunk data' })
    @ApiResponse({ status: 201, description: 'Issue chunk created' })
    @Post()
    async insert(@Body() createIssueChunksDto: CreateIssueChunksDto) {
        return await this.issueChunkService.insert(createIssueChunksDto);
    }

    @ApiOperation({ summary: 'Search similar issue chunks' })
    @ApiBody({ type: SearchChunksDto, description: 'Search criteria' })
    @ApiResponse({ status: 200, description: 'Search results' })
    @Post('search')
    async search(@Body() searchIssueChunksDto: SearchChunksDto ) {
        return await this.issueChunkService.search(searchIssueChunksDto);
    }
}