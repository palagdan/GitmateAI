import {Injectable, Logger} from '@nestjs/common';
import {IssueChunksRepository} from './issue-chunks.repository';
import {CreateIssueChunksDto} from './dto/create-issue-chunks.dto';
import {splitText} from '../utils/llm-utils';
import {IssueDto} from './dto/issue.dto';
import {SearchChunksDto} from "../common/dto/search-chunks.dto";
import {IssueContentType} from "./types";
import {IssueCommentDto} from "./dto/issue-comment.dto";

@Injectable()
export class IssueChunksService {
    private readonly logger = new Logger(IssueChunksService.name);

    constructor(private readonly repository: IssueChunksRepository) {}

    async findAll() {
        this.logger.log('Fetching all issue chunks');
        return await this.repository.findAll();
    }

    async findByOwnerRepoIssue(issueDto: IssueDto) {
        const { owner, repo, issueId } = issueDto;
        this.logger.log(`Fetching issue chunks for owner: ${owner}, repo: ${repo}, issue: ${issueId}`);
        return await this.repository.findByOwnerRepoIssue(owner, repo, issueId);
    }

    async findByOwnerRepoIssueCommentId(issueCommentDto: IssueCommentDto){
        const { owner, repo, issueId, commentId } = issueCommentDto;
        this.logger.log(`Fetching issue comment chunks for owner: ${owner}, repo: ${repo}, issue: ${issueId}`);
        return await this.repository.findByOwnerRepoIssueCommentId({
            owner,
            repo,
            issueId,
            commentId
        });
    }

    async findTitleByOwnerRepoIssue(issueDto: IssueDto){
        const { owner, repo, issueId } = issueDto;
        this.logger.log(`Fetching issue title chunks for owner: ${owner}, repo: ${repo}, issue: ${issueId}`);
        return await this.repository.findTitleByOwnerRepoIssue({
            owner,
            repo,
            issueId,
        });
    }

    async findDescriptionByOwnerRepoIssue(issueDto: IssueDto){
        const { owner, repo, issueId } = issueDto;
        this.logger.log(`Fetching issue description chunks for owner: ${owner}, repo: ${repo}, issue: ${issueId}`);
        return await this.repository.findDescriptionByOwnerRepoIssue({
            owner,
            repo,
            issueId
        });
    }

    async deleteByOwnerRepoIssue(issueDto: IssueDto) {
        const { owner, repo, issueId } = issueDto;
        this.logger.log(`Deleting issue chunks for owner: ${owner}, repo: ${repo}, issue: ${issueId}`);
        return await this.repository.deleteByOwnerRepoIssue({
            owner,
            repo,
            issueId: issueId
        });
    }

    async insert(issue: CreateIssueChunksDto) {
        this.logger.log(`Inserting issue chunks for owner: ${issue.owner}, repo: ${issue.repo}, issue: ${issue.issueId}`);

        const chunks: string[] = await splitText(issue.content);
        this.logger.log(`Split issue text into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert({
                content: chunk,
                type: issue.type,
                author: issue.author,
                commentId: issue.commentId,
                owner: issue.owner,
                repo: issue.repo,
                issueId: issue.issueId
            });
        }
        this.logger.log('Insertion completed');
    }

    async update(createIssueChunksDto: CreateIssueChunksDto) {
        this.logger.log(`Updating issue chunks for owner: ${createIssueChunksDto.owner}, repo: ${createIssueChunksDto.repo}, issue: ${createIssueChunksDto.issueId}`);
        if(createIssueChunksDto.type == IssueContentType.Comment){
            await this.repository.deleteCommentByOwnerRepoIssueCommentId({
                owner: createIssueChunksDto.owner,
                repo: createIssueChunksDto.repo,
                issueId: createIssueChunksDto.issueId,
                commentId: createIssueChunksDto.commentId
            });
        }else if(createIssueChunksDto.type == IssueContentType.Title){
            await this.repository.deleteDescriptionByOwnerRepoIssue({
                owner: createIssueChunksDto.owner,
                repo: createIssueChunksDto.repo,
                issueId: createIssueChunksDto.issueId
            });
        }else if(createIssueChunksDto.type == IssueContentType.Description){
            await this.repository.deleteTitleByOwnerRepoIssue({
                owner: createIssueChunksDto.owner,
                repo: createIssueChunksDto.repo,
                issueId: createIssueChunksDto.issueId
            });
        }

        return await this.insert(createIssueChunksDto);
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