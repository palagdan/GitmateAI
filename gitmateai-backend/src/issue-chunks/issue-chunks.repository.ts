import { Injectable, OnModuleInit } from '@nestjs/common';
import { WeaviateService } from '../weaviate/weaviate.service';
import { Collection, Filters } from 'weaviate-client';
import {CreateIssueChunksDto} from "./dto/create-issue-chunks.dto";
import {Issue, IssueChunk, IssueComment, IssueContentType} from "./types";

@Injectable()
export class IssueChunksRepository implements OnModuleInit {
    private collection: any;

    constructor(private readonly weaviateService: WeaviateService) {}

    async onModuleInit() {
        this.collection = this.weaviateService.getClient().collections.get('IssueChunks');
    }

    async deleteByOwnerRepoIssue(issue: Issue) {
        const { owner, repo, issueNumber } = issue;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
            ),
        );
    }

    async deleteTitleByOwnerRepoIssue(issue: Issue) {
        const { owner, repo, issueNumber } = issue;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Title),
            ),
        );
    }

    async deleteDescriptionByOwnerRepoIssue(issue: Issue) {
        const { owner, repo, issueNumber } = issue;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Description),
            ),
        );
    }

    async deleteCommentByOwnerRepoIssueCommentId(issueComment: IssueComment) {
        const { owner, repo, issueNumber, commentId } = issueComment;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('commentId').equal(commentId),
            ),
        );
    }

    async insert(issueChunk: IssueChunk) {
        return await this.collection.data.insert(issueChunk);
    }

    async findAll() {
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all"
        });
        return result.objects;
    }

    async findByOwnerRepoIssue(owner: string, repo: string, issue: number) {
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issue),
            ),
        });
        return result.objects;
    }

    async findByOwnerRepoIssueCommentId(issueComment: IssueComment) {
        const { owner, repo, issueNumber, commentId } = issueComment;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('commentId').equal(commentId),
            ),
        });
        return result.objects;
    }

    async findTitleByOwnerRepoIssue(issue: Issue) {
        const { owner, repo, issueNumber, } = issue;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Title),
            ),
        });
        return result.objects;
    }

    async findDescriptionByOwnerRepoIssue(issue: Issue) {
        const { owner, repo, issueNumber } = issue;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issueNumber').equal(issueNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Description),
            ),
        });
        return result.objects;
    }

    async search(content: string, filters) {
        const { limit, fields, exclude } = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? ['content', 'owner', 'repo', 'issueNumber', 'commentId', 'type', 'author'];

        let result;

        if(exclude){
             result = await this.collection.query.nearText(content, {
                returnProperties: returnProperties,
                limit: finalLimit,
                returnMetadata: "all",
                filters:  Filters.or(
                    this.collection.filter.byProperty('owner').notEqual(exclude.owner),
                    this.collection.filter.byProperty('repo').notEqual(exclude.repo),
                    this.collection.filter.byProperty('issueNumber').notEqual(exclude.issueNumber)
                )
            });
        }else{
            result = await this.collection.query.nearText(content, {
                returnProperties: returnProperties,
                limit: finalLimit,
                returnMetadata: "all",
            });
        }

        return result.objects;
    }
}