import { Injectable, Logger } from '@nestjs/common';
import { IssueChunksRepository } from './issue-chunks.repository';
import { CreateIssueChunksDto } from './dto/create-issue-chunks.dto';
import { splitText } from '../utils/llm-utils';
import { IssueDto } from './dto/issue.dto';
import { SearchChunksDto } from "../common/dto/search-chunks.dto";
import {OllamaService} from "../embedding/ollama.service";

@Injectable()
export class IssueChunksService {
    private readonly logger = new Logger(IssueChunksService.name);

    constructor(private readonly repository: IssueChunksRepository, private readonly ollamaService: OllamaService) {}

    async findAll() {
        this.logger.log('Fetching all issue chunks');
        return await this.repository.findAll();
    }

    async findByOwnerRepoIssue(issueDto: IssueDto) {
        const { owner, repo, issue } = issueDto;
        this.logger.log(`Fetching issue chunks for owner: ${owner}, repo: ${repo}, issue: ${issue}`);
        return await this.repository.findByOwnerRepoIssue(owner, repo, issue);
    }

    async deleteByOwnerRepoIssue(issueDto: IssueDto) {
        const { owner, repo, issue } = issueDto;
        this.logger.log(`Deleting issue chunks for owner: ${owner}, repo: ${repo}, issue: ${issue}`);
        return await this.repository.deleteByOwnerRepoIssue(owner, repo, issue);
    }

    async insert(issueChunks: CreateIssueChunksDto) {
        const { content, owner, repo, issue } = issueChunks;
        this.logger.log(`Inserting issue chunks for owner: ${owner}, repo: ${repo}, issue: ${issue}`);

        const chunks: string[] = await splitText(content);
        this.logger.log(`Split issue text into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            const vector = await this.ollamaService.embed(chunk);
            await this.repository.insert(vector, chunk, owner, repo, issue);
        }

        this.logger.log('Insertion completed');
    }

    async update(repo: string, issue: string) {
        this.logger.log(`Updating issue chunks for repo: ${repo}, issue: ${issue}`);
        // Implementation for update
    }

    async search(searchIssueChunksDto: SearchChunksDto) {
        const { content, limit, fields } = searchIssueChunksDto;
        this.logger.log(`Searching issue chunks with limit: ${limit}, fields: ${JSON.stringify(fields)}`);

        const vector = await this.ollamaService.embed(content);


        const result: any = await this.repository.search(vector, { limit, fields });

        this.logger.log(`Returning ${result.length} search results`);
        return result;
    }
}