import { Injectable, Logger } from '@nestjs/common';
import { IssueChunksRepository } from './issue-chunks.repository';
import { CreateIssueChunksDto } from './dto/create-issue-chunks.dto';
import { splitText } from '../utils/llm-utils';
import { IssueDto } from './dto/issue.dto';
import { SearchChunksDto } from "../common/dto/search-chunks.dto";

@Injectable()
export class IssueChunksService {
    private readonly logger = new Logger(IssueChunksService.name);

    constructor(private readonly repository: IssueChunksRepository) {}

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
            await this.repository.insert(chunk, owner, repo, issue);
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

        const chunks: string[] = await splitText(content);
        this.logger.log(`Split search content into ${chunks.length} chunks`);

        let allResults: any = [];
        for (const chunk of chunks) {
            const chunkResult: any = await this.repository.search(chunk, { limit, fields });
            allResults.push(...chunkResult);
        }

        const sortedResults = Array.from(new Map(allResults.map(r => [r.uuid, r])).values())
            .sort((a: any, b: any) => a.metadata.distance - b.metadata.distance)
            .slice(0, limit);

        this.logger.log(`Returning ${sortedResults.length} search results`);
        return sortedResults;
    }
}