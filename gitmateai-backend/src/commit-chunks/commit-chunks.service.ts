import {Injectable, Logger} from '@nestjs/common';
import { CreateCommitChunksDto } from './dto/create-commit-chunks.dto';
import { SearchChunksDto } from '../common/dto/search-chunks.dto';
import {CommitChunksRepository} from "./commit-chunks.repository";
import {CommitDto} from "./dto/commit.dto";
import {splitCode} from "../utils/llm-utils";
import {OwnerRepoDto} from "../common/dto/owner-repo.dto";

@Injectable()
export class CommitChunksService {

    private readonly logger = new Logger(CommitChunksRepository.name);


    constructor(private readonly repository: CommitChunksRepository) {}


    async findAll(){
        this.logger.log('Fetching all commit chunks');
        return this.repository.findAll();
    }

    async findByOwnerRepoSha(commitDto: CommitDto) {
        this.logger.log(`Fetching commit chunks for owner: ${commitDto.owner}, repo: ${commitDto.repo}, sha: ${commitDto.sha}`);
        return this.repository.findByOwnerRepoSha({
            owner: commitDto.owner,
            repo: commitDto.repo,
            sha: commitDto.sha,
        })
    }


    async deleteByOwnerRepoSha(commitDto: CommitDto) {
        const { owner, repo, sha } = commitDto;
        this.logger.log(`Deleting commit chunks for owner: ${owner}, repo: ${repo}, sha: ${sha}`);
        return this.repository.deleteByOwnerRepoSha({
            owner: owner,
            repo: repo,
            sha: sha,
        });
    }

    async insert(createCommitChunksDto: CreateCommitChunksDto) {
        this.logger.log(`Inserting commit chunks for owner: ${createCommitChunksDto.owner}, repo: ${createCommitChunksDto.repo}, sha: ${createCommitChunksDto.sha}`);

        const chunks: string[] = await splitCode(createCommitChunksDto.content, createCommitChunksDto.fileName);

        this.logger.log(`Split commit into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert({
                content: chunk,
                fileName: createCommitChunksDto.fileName,
                owner: createCommitChunksDto.owner,
                repo: createCommitChunksDto.repo,
                sha: createCommitChunksDto.sha,
                author: createCommitChunksDto.author,
                commitMessage: createCommitChunksDto.commitMessage,
            });
        }
        this.logger.log('Insertion completed');
    }

    async search(searchCommitChunksDto: SearchChunksDto) {
        const { content, limit, fields } = searchCommitChunksDto;
        this.logger.log(`Searching code chunks with limit: ${limit}, fields: ${JSON.stringify(fields)}`);

        const result: any = await this.repository.search(content, limit, fields );

        this.logger.log(`Returning ${result.length} search results`);
        return result;
    }

    async update(updateCommitChunksDto: CreateCommitChunksDto) {
        this.logger.log(`Updating commit chunks for owner: ${updateCommitChunksDto.owner}, repo: ${updateCommitChunksDto.repo}, sha: ${updateCommitChunksDto.sha}`);
        await this.deleteByOwnerRepoSha({
            owner: updateCommitChunksDto.owner,
            repo: updateCommitChunksDto.repo,
            sha: updateCommitChunksDto.sha,
        })
        return await this.insert(updateCommitChunksDto);
    }

    async findByOwnerRepo(ownerRepoDto: OwnerRepoDto) {
        this.logger.log(`Fetching commit chunks for owner: ${ownerRepoDto.owner}, repo: ${ownerRepoDto.repo}`);
        return this.repository.findByOwnerRepo({
            owner: ownerRepoDto.owner,
            repo: ownerRepoDto.repo,
        });
    }
}