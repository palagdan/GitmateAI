import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam
} from '@nestjs/swagger';
import { ConventionChunksService } from './convention-chunks.service';
import { CreateConventionChunksDto } from './dto/createConventionChunksDto';
import {SearchChunksDto} from "../common/dto/search-chunks.dto";

@ApiTags('Convention Chunks')
@Controller('convention-chunks')
export class ConventionChunksController {
    constructor(private readonly conventionChunksService: ConventionChunksService) {}

    @Get()
    @ApiOperation({ summary: 'Get all convention chunks' })
    @ApiResponse({ status: 200, description: 'List of all convention chunks' })
    async getAll() {
        return await this.conventionChunksService.findAll();
    }

    @Get(':source')
    @ApiOperation({ summary: 'Get convention chunks by source' })
    @ApiParam({ name: 'source', type: String })
    @ApiResponse({ status: 200, description: 'Convention chunks for the given source' })
    async getBySource(@Param('source') source: string) {
        return await this.conventionChunksService.findBySource(source);
    }

    @Delete(':source')
    @ApiOperation({ summary: 'Delete convention chunks by source' })
    @ApiParam({ name: 'source', type: String })
    @ApiResponse({ status: 200, description: 'Convention chunks deleted successfully' })
    async deleteBySource(@Param('source') source: string) {
        return await this.conventionChunksService.deleteBySource(source);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete all convention chunks' })
    @ApiResponse({ status: 200, description: 'All convention chunks deleted successfully' })
    async deleteAll() {
        return await this.conventionChunksService.deleteAll();
    }

    @Post()
    @ApiOperation({ summary: 'Insert a new convention chunk' })
    @ApiBody({ type: CreateConventionChunksDto })
    @ApiResponse({ status: 201, description: 'Convention chunk inserted successfully' })
    async insert(@Body() contentDto: CreateConventionChunksDto) {
        return await this.conventionChunksService.insert(contentDto);
    }

    @Post('search')
    @ApiOperation({ summary: 'Search convention chunks' })
    @ApiBody({ type: SearchChunksDto })
    @ApiResponse({ status: 200, description: 'Search results for convention chunks' })
    async search(@Body() searchChunksDto: SearchChunksDto) {
        return await this.conventionChunksService.search(searchChunksDto);
    }
}
