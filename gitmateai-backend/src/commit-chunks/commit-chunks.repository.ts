import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";
import { Filters} from "weaviate-client";
import {Commit, CommitChunk} from "./type";
import {OwnerRepo} from "../common/types";


@Injectable()
export class CommitChunksRepository implements OnModuleInit {

    private collection: any;

    constructor(private readonly weaviateService: WeaviateService) {}

    async onModuleInit() {
        this.collection = this.weaviateService.getClient().collections.get('CommitChunks');
    }

    async findAll() {
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all"
        });
        return result.objects;
    }

    async findByOwnerRepo(ownerRepo: OwnerRepo) {
        const { owner, repo } = ownerRepo;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
            ),
        });
        return result.objects;
    }

    async findByOwnerRepoSha(commit: Commit) {
        const { owner, repo, sha } = commit;
        const result = await this.collection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('sha').equal(sha),
            ),
        });
        return result.objects;
    }

    async deleteByOwnerRepoSha(commit: Commit) {
        const { owner, repo, sha } = commit;
        const result = await this.collection.query.deleteMany({
            returnMetadata: "all",
            filters: Filters.and(
                this.collection.filter.byProperty('owner').equal(owner),
                this.collection.filter.byProperty('repo').equal(repo),
                this.collection.filter.byProperty('sha').equal(sha),
            ),
        });
        return result.objects;
    }

    async insert(commitChunk: CommitChunk) {
        return await this.collection.data.insert(commitChunk);
    }

    async search(content: string, limit?: number, fields?: string[]) {
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? undefined;

        const result = await this.collection.query.nearText(content, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });

        return result.objects;

    }
}