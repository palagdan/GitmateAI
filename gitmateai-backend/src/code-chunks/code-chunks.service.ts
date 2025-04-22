import { Injectable, Logger } from '@nestjs/common';
import { CreateCodeChunksDto } from "./dto/create-code-chunks.dto";
import { CodeChunksRepository } from "./code-chunks.repository";
import {splitCode, splitText} from "../utils/llm-utils";
import {SearchChunksDto} from "../common/dto/search-chunks.dto";
import {SearchCodeChunksDto} from "./dto/search-code-chunks.dto";

@Injectable()
export class CodeChunksService {
    private readonly logger = new Logger(CodeChunksService.name);

    constructor(private readonly repository: CodeChunksRepository) {}

    async findAll() {
        this.logger.log('Fetching all code chunks');
        return await this.repository.findAll();
    }

    async findByOwner(owner: string) {
        this.logger.log(`Fetching code chunks for owner: ${owner}`);
        return await this.repository.findByOwner(owner);
    }

    async findByOwnerRepo(owner: string, repo: string) {
        this.logger.log(`Fetching code chunks for owner: ${owner}, repo: ${repo}`);
        return await this.repository.findByOwnerRepo(owner, repo);
    }

    async findByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
        this.logger.log(`Fetching code chunks for owner: ${owner}, repo: ${repo}, filePath: ${filePath}`);
        return await this.repository.findByOwnerRepoFilePath(owner, repo, filePath);
    }

    async insert(codeChunks: CreateCodeChunksDto) {
        const { content, owner, repo, filePath } = codeChunks;
        this.logger.log(`Inserting code chunks for owner: ${owner}, repo: ${repo}, filePath: ${filePath}`);

        const chunks = await splitCode(content, filePath);
        this.logger.log(`Split code into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert(chunk, owner, repo, filePath);
        }
        this.logger.log('Insertion completed');
    }

    async deleteByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
        this.logger.log(`Deleting code chunks for owner: ${owner}, repo: ${repo}, filePath: ${filePath}`);
        return await this.repository.deleteByOwnerRepoFilePath(owner, repo, filePath);
    }

    async deleteByOwnerRepo(owner: string, repo: string) {
        this.logger.log(`Deleting code chunks for owner: ${owner}, repo: ${repo}`);
        return await this.repository.deleteByOwnerRepo(owner, repo);
    }

    async deleteByOwner(owner: string) {
        this.logger.log(`Deleting code chunks for owner: ${owner}`);
        return await this.repository.deleteByOwner(owner);
    }

    async search(searchCodeChunksDto: SearchCodeChunksDto) {
        const { content, limit, fields } = searchCodeChunksDto;
        this.logger.log(`Searching code chunks with limit: ${limit}, fields: ${JSON.stringify(fields)}`);

        const result: any = await this.repository.search(content, { limit, fields });

        this.logger.log(`Returning ${result.length} search results`);
        return result;
    }
}
