import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";
import {Filters} from "weaviate-client";
import {Issue, IssueChunk, IssueComment, IssueContentType} from "../issue-chunks/types";
import {PR, PRChunk, PRComment, PRContentType} from "./types";


@Injectable()
export class PRChunksRepository implements OnModuleInit {

    private collection: any;

    constructor(private readonly weaviateService: WeaviateService) {}


    async onModuleInit() {
        this.collection = this.weaviateService.getClient().collections.get('PRChunks');
    }


    async findAll() {
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all"
        });
        return result.objects;
    }

    async findByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
            ),
        });
        return result.objects;
    }

    async findByOwnerRepoPRCommentId(prComment: PRComment) {
        const { owner, repo, prNumber, commentId } = prComment;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('commentId').equal(commentId),
            ),
        });
        return result.objects;
    }

    async findTitleByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('type').equal(PRContentType.Title),
            ),
        });
        return result.objects;
    }

    async findDescriptionByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('type').equal(PRContentType.Description),
            ),
        });
        return result.objects;
    }

    async deleteByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
            ),
        );
    }

    async deleteTitleByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Title),
            ),
        );
    }

    async deleteDescriptionByOwnerRepoPR(pr: PR) {
        const { owner, repo, prNumber } = pr;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('type').equal(IssueContentType.Description),
            ),
        );
    }


    async deleteCommentByOwnerRepoPRCommentId(prComment: PRComment) {
        const { owner, repo, prNumber, commentId } = prComment;
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('prNumber').equal(prNumber),
                this.collection.filter.byProperty('commentId').equal(commentId),
            ),
        );
    }

    async insert(prChunk: PRChunk) {
        return await this.collection.data.insert(prChunk);
    }

    async search(content: string, filters) {
        const { limit, fields } = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? ['content', 'owner', 'repo', 'prNumber', 'commentId', 'type', 'author'];

        const result = await this.collection.query.nearText(content, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });
        return result.objects;
    }








}