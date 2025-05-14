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
import { CommitChunksService } from './commit-chunks.service';
import { CreateCommitChunksDto } from './dto/create-commit-chunks.dto';
import { SearchChunksDto } from '../common/dto/search-chunks.dto';
import { CommitDto } from './dto/commit.dto';
import { OwnerRepoDto } from '../common/dto/owner-repo.dto';

@ApiTags('Commit Chunks')
@Controller('commit-chunks')
export class CommitChunksController {
    constructor(private readonly commitChunksService: CommitChunksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all commit chunks' })
    @ApiResponse({ status: 200, description: 'List of all commit chunks' })
    async getAll() {
        return await this.commitChunksService.findAll();
    }

    @Get(':owner/:repo/:sha')
    @ApiOperation({ summary: 'Get commit chunks by owner, repo, and sha' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'sha', type: String })
    @ApiResponse({ status: 200, description: 'Chunks for the specified commit' })
    async getByOwnerRepoSha(@Param() commitDto: CommitDto) {
        return await this.commitChunksService.findByOwnerRepoSha(commitDto);
    }

    @Get(':owner/:repo')
    @ApiOperation({ summary: 'Get all commit chunks by owner and repo' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiResponse({ status: 200, description: 'Commit chunks for the repo' })
    async getByOwnerRepo(@Param() ownerRepoDto: OwnerRepoDto) {
        return await this.commitChunksService.findByOwnerRepo(ownerRepoDto);
    }

    @Delete(':owner/:repo/:sha')
    @ApiOperation({ summary: 'Delete commit chunks by owner, repo, and sha' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiParam({ name: 'sha', type: String })
    @ApiResponse({ status: 200, description: 'Commit chunks deleted successfully' })
    async deleteByOwnerRepoSha(@Param() commitDto: CommitDto) {
        return await this.commitChunksService.deleteByOwnerRepoSha(commitDto);
    }

    @Post()
    @ApiOperation({ summary: 'Insert commit chunks' })
    @ApiBody({ type: CreateCommitChunksDto })
    @ApiResponse({ status: 201, description: 'Commit chunks inserted successfully' })
    async insert(@Body() createCommitChunksDto: CreateCommitChunksDto) {
        return await this.commitChunksService.insert(createCommitChunksDto);
    }

    @Post('search')
    @ApiOperation({ summary: 'Search commit chunks' })
    @ApiBody({ type: SearchChunksDto })
    @ApiResponse({ status: 200, description: 'Search results for commit chunks' })
    async search(@Body() searchChunksDto: SearchChunksDto) {
        return await this.commitChunksService.search(searchChunksDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update commit chunks' })
    @ApiBody({ type: CreateCommitChunksDto })
    @ApiResponse({ status: 200, description: 'Commit chunks updated successfully' })
    async update(@Body() updateCommitChunksDto: CreateCommitChunksDto) {
        return await this.commitChunksService.update(updateCommitChunksDto);
    }
}
