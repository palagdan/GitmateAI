import {Injectable, Logger} from "@nestjs/common";
import {PRChunksRepository} from "./pr-chunks.repository";
import {PRDto} from "./dto/pr.dto";
import {PRCommentDto} from "./dto/pr-comment.dto";
import {CreatePRChunksDto} from "./dto/create-pr-chunks.dto";
import {splitText} from "../utils/llm-utils";
import {SearchChunksDto} from "../common/dto/search-chunks.dto";
import {CreateIssueChunksDto} from "../issue-chunks/dto/create-issue-chunks.dto";
import {IssueContentType} from "../issue-chunks/types";
import {PRContentType} from "./types";

@Injectable()
export class PRChunksService {

    private readonly logger = new Logger(PRChunksService.name);


    constructor(private readonly repository: PRChunksRepository) {
    }

    async findAll() {
        this.logger.log('Fetching all PR chunks');
        return await this.repository.findAll();
    }


    async findByOwnerRepoPR(prDto: PRDto) {
        const {owner, repo, prNumber} = prDto;
        this.logger.log(`Fetching PR chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}`);
        return await this.repository.findByOwnerRepoPR({
            owner,
            repo,
            prNumber
        });
    }

    async findByOwnerRepoPRCommentId(prCommentDto: PRCommentDto) {
        const {owner, repo, prNumber, commentId} = prCommentDto;
        this.logger.log(`Fetching PR comment chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}, commentId: ${commentId}`);
        return await this.repository.findByOwnerRepoPRCommentId({
            owner,
            repo,
            prNumber,
            commentId
        });
    }

    async findTitleByOwnerRepoPR(prDto: PRDto) {
        const {owner, repo, prNumber} = prDto;
        this.logger.log(`Fetching PR title chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}`);
        return await this.repository.findTitleByOwnerRepoPR({
            owner,
            repo,
            prNumber
        });
    }

    async findDescriptionByOwnerRepoPR(prDto: PRDto) {
        const {owner, repo, prNumber} = prDto;
        this.logger.log(`Fetching PR description chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}`);
        return await this.repository.findDescriptionByOwnerRepoPR({
            owner,
            repo,
            prNumber
        });
    }

    async deleteByOwnerRepoPR(prDto: PRDto) {
        const {owner, repo, prNumber} = prDto;
        this.logger.log(`Deleting PR chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}`);
        return await this.repository.deleteByOwnerRepoPR({
            owner,
            repo,
            prNumber
        });
    }

    async deleteCommentByOwnerRepoPRCommentId(prCommentDto: PRCommentDto) {
        const {owner, repo, prNumber, commentId} = prCommentDto;
        this.logger.log(`Deleting PR comment chunks for owner: ${owner}, repo: ${repo}, PR: ${prNumber}, commentId: ${commentId}`);
        return await this.repository.deleteCommentByOwnerRepoPRCommentId({
            owner,
            repo,
            prNumber,
            commentId
        });
    }

    async search(searchPRChunksDto: SearchChunksDto) {
        const {content, limit, fields} = searchPRChunksDto;
        this.logger.log(`Searching PR chunks with limit: ${limit}, fields: ${JSON.stringify(fields)}`);
        const result  = await this.repository.search(content, {limit, fields});
        this.logger.log(`Returning ${result.length} search results`);
        return result;
    }

    async insert(pr: CreatePRChunksDto) {
        this.logger.log(`Inserting PR chunks for owner: ${pr.owner}, repo: ${pr.repo}, PR: ${pr.prNumber}`);

        const chunks: string[] = await splitText(pr.content);
        this.logger.log(`Split pr text into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert({
                content: chunk,
                type: pr.type,
                author: pr.author,
                commentId: pr.commentId,
                owner: pr.owner,
                repo: pr.repo,
                prNumber: pr.prNumber,
            });
        }
        this.logger.log('Insertion completed');
    }

    async update(createPRChunksDto: CreatePRChunksDto) {
        this.logger.log(`Updating PR chunks for owner: ${createPRChunksDto.owner}, repo: ${createPRChunksDto.repo}, PR: ${createPRChunksDto.prNumber}`);
        if (createPRChunksDto.type == PRContentType.Comment) {
            await this.repository.deleteCommentByOwnerRepoPRCommentId({
                owner: createPRChunksDto.owner,
                repo: createPRChunksDto.repo,
                prNumber: createPRChunksDto.prNumber,
                commentId: createPRChunksDto.commentId
            });
        } else if (createPRChunksDto.type == PRContentType.Title) {
            await this.repository.deleteDescriptionByOwnerRepoPR({
                owner: createPRChunksDto.owner,
                repo: createPRChunksDto.repo,
                prNumber: createPRChunksDto.prNumber
            });
        } else if (createPRChunksDto.type == PRContentType.Description) {
            await this.repository.deleteTitleByOwnerRepoPR({
                owner: createPRChunksDto.owner,
                repo: createPRChunksDto.repo,
                prNumber: createPRChunksDto.prNumber
            });
        }

        return await this.insert(createPRChunksDto);
    }

}