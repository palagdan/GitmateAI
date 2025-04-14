import {Controller, Get, Post, Body, Param, Delete, Query, Put} from '@nestjs/common';
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
    @Get(':owner/:repo/:issueNumber')
    async getByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.findByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issueNumber/comments/:commentId')
    async getByOwnerRepoIssueCommentId(@Param() issue: IssueCommentDto) {
        return this.issueChunkService.findByOwnerRepoIssueCommentId(issue);
    }

    @Get(':owner/:repo/:issueNumber/title')
    async getTitleByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findTitleByOwnerRepoIssue(issue);
    }

    @Get(':owner/:repo/:issueNumber/description')
    async getDescriptionByOwnerRepoIssue(@Param() issue: IssueDto) {
        return this.issueChunkService.findDescriptionByOwnerRepoIssue(issue);
    }

    @ApiOperation({ summary: 'Delete all issue chunks by owner, repo, and issue number' })
    @ApiParam({ name: 'owner', type: 'string', description: 'Repository owner' })
    @ApiParam({ name: 'repo', type: 'string', description: 'Repository name' })
    @ApiParam({ name: 'issue', type: 'number', description: 'Issue number' })
    @ApiResponse({ status: 200, description: 'Issue chunk deleted' })
    @ApiResponse({ status: 404, description: 'Issue chunk not found' })
    @Delete(':owner/:repo/:issueNumber')
    async deleteByOwnerRepoIssue(@Param() issue: IssueDto) {
        return await this.issueChunkService.deleteByOwnerRepoIssue(issue);
    }

    @Delete(':owner/:repo/:issueNumber/comments/:commentId')
    async deleteCommentByOwnerRepoIssueCommentId(@Param() issueCommentDto: IssueCommentDto) {
        return await this.issueChunkService.deleteCommentByOwnerRepoIssueCommentId(issueCommentDto);
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

    @Put()
    async update(@Body()  updateIssueChunksDto: CreateIssueChunksDto){
        return await this.issueChunkService.update(updateIssueChunksDto);
    }


}