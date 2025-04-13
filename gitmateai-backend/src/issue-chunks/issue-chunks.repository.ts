import {Injectable, OnModuleInit} from '@nestjs/common';
import {WeaviateService} from '../weaviate/weaviate.service';
import {Collection, Filters} from 'weaviate-client';

@Injectable()
export class IssueChunksRepository implements OnModuleInit {
    private collection: any;

    constructor(private readonly weaviateService: WeaviateService) {
    }

    async onModuleInit() {
        this.collection = this.weaviateService.getClient().collections.get('IssueChunks');
    }

    private getCollection() {
        return this.weaviateService.getClient().collections.get('IssueChunks');
    }

    async deleteByOwnerRepoIssue(owner: string, repo: string, issue: number) {
        return await this.collection.data.deleteMany(
            Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issue').equal(issue),
            ),
        );
    }

    async insert(vector, content: string, owner: string, repo: string, issue: number) {
        return await this.collection.data.insert({
                vectors: vector,
                properties: {
                    content: content,
                    owner: owner,
                    repo: repo,
                    issue: issue,
                },
            }
        );
    }

    async findAll() {
        const collection: Collection = this.getCollection();
        const result = await collection.query.fetchObjects({
            returnMetadata: "all",
        });
        return result.objects;
    }

    async findByOwnerRepoIssue(owner: string, repo: string, issue: number) {
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('issue').equal(issue),
            ),
        });
        return result.objects;
    }

    async search(vector, filters) {
        const {limit, fields} = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? ['content', 'owner', 'repo', 'issue'];

        const result = await this.collection.query.nearVector(vector, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });
        return result.objects;
    }
}