import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { CodeChunksService } from './code-chunks.service';
import { CreateCodeChunksDto } from './dto/create-code-chunks.dto';
import {SearchChunksDto} from "../common/dto/search-chunks.dto";


@ApiTags('Code Chunks')
@Controller('code-chunks')
export class CodeChunksController {
    constructor(private readonly codeChunksService: CodeChunksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all code chunks' })
    @ApiResponse({ status: 200, description: 'All code chunks' })
    async getAll() {
        return await this.codeChunksService.findAll();
    }

    @Get(':owner')
    @ApiOperation({ summary: 'Get code chunks by owner' })
    @ApiParam({ name: 'owner', type: String })
    @ApiResponse({ status: 200, description: 'Chunks for the specified owner' })
    async getByOwner(@Param('owner') owner: string) {
        return await this.codeChunksService.findByOwner(owner);
    }

    @Get(':owner/:repo/file')
    @ApiOperation({ summary: 'Get code chunks by file path in repo' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiQuery({ name: 'path', type: String, required: true })
    @ApiResponse({ status: 200, description: 'Chunks for specific file path' })
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

    @Get(':owner/:repo')
    @ApiOperation({ summary: 'Get code chunks by owner and repo' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiResponse({ status: 200, description: 'Chunks for repo under owner' })
    async getByOwnerRepo(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
    ) {
        return await this.codeChunksService.findByOwnerRepo(owner, repo);
    }

    @Delete(':owner')
    @ApiOperation({ summary: 'Delete code chunks by owner' })
    @ApiParam({ name: 'owner', type: String })
    @ApiResponse({ status: 200, description: 'Chunks deleted for owner' })
    async deleteByOwner(@Param('owner') owner: string) {
        return await this.codeChunksService.deleteByOwner(owner);
    }

    @Delete(':owner/:repo/file')
    @ApiOperation({ summary: 'Delete code chunks by file path' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiQuery({ name: 'path', type: String, required: true })
    @ApiResponse({ status: 200, description: 'Chunks deleted for file path' })
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

    @Delete(':owner/:repo')
    @ApiOperation({ summary: 'Delete code chunks by owner and repo' })
    @ApiParam({ name: 'owner', type: String })
    @ApiParam({ name: 'repo', type: String })
    @ApiResponse({ status: 200, description: 'Chunks deleted for repo' })
    async deleteByOwnerRepo(
        @Param('owner') owner: string,
        @Param('repo') repo: string,
    ) {
        return await this.codeChunksService.deleteByOwnerRepo(owner, repo);
    }

    @Post()
    @ApiOperation({ summary: 'Insert code chunks' })
    @ApiBody({ type: CreateCodeChunksDto })
    @ApiResponse({ status: 201, description: 'Code chunks inserted' })
    async insert(@Body() createCodeChunksDto: CreateCodeChunksDto) {
        return await this.codeChunksService.insert(createCodeChunksDto);
    }

    @Post('search')
    @ApiOperation({ summary: 'Search code chunks' })
    @ApiBody({ type: SearchChunksDto })
    @ApiResponse({ status: 200, description: 'Search results' })
    async search(@Body() searchChunksDto: SearchChunksDto) {
        return await this.codeChunksService.search(searchChunksDto);
    }
}
