import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { CommitChunksService } from "./commit-chunks.service";
import { CreateCommitChunksDto } from "./dto/create-commit-chunks.dto";
import { SearchChunksDto } from "../common/dto/search-chunks.dto";
import {CommitDto} from "./dto/commit.dto";
import {OwnerRepoDto} from "../common/dto/owner-repo.dto";
import {Commit} from "./type";

@Controller('commit-chunks')
export class CommitChunksController {
    constructor(private readonly commitChunksService: CommitChunksService) {}

    @Get()
    async getAll() {
        return await this.commitChunksService.findAll();
    }

    @Get(':owner/:repo/:sha')
    async getByOwnerRepoSha(
        @Param() commitDto: CommitDto
    ) {
        return await this.commitChunksService.findByOwnerRepoSha(commitDto);
    }

    @Get(':owner/:repo')
    async getByOwnerRepo(
        @Param() ownerRepoDto: OwnerRepoDto
    ) {
        return await this.commitChunksService.findByOwnerRepo(ownerRepoDto);
    }

    @Delete(':owner/:repo/:sha')
    async deleteByOwnerRepoSha(
        @Param() commitDto: CommitDto
    ) {
        return await this.commitChunksService.deleteByOwnerRepoSha(commitDto);
    }

    @Post()
    async insert(@Body() createCommitChunksDto: CreateCommitChunksDto){
        return await this.commitChunksService.insert(createCommitChunksDto);
    }

    @Post("search")
    async search(@Body() searchChunksDto: SearchChunksDto){
        return await this.commitChunksService.search(searchChunksDto);
    }

    @Put()
    async update(@Body() updateCommitChunksDto: CreateCommitChunksDto){
        return await this.commitChunksService.update(updateCommitChunksDto);
    }
}