import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";
import {Collection, Filters} from "weaviate-client";


@Injectable()
export class CodeChunksRepository implements OnModuleInit{

    private codeChunksCollection: any;

    constructor(private readonly weaviateService: WeaviateService) {
    }

    async onModuleInit() {
        this.codeChunksCollection = this.weaviateService.getClient().collections.get('CodeChunks');
    }


    async findAll() {
        const result = await this.codeChunksCollection.query.fetchObjects({
            returnMetadata: "all"
        })
        return result.objects;
    }

    async findByOwner(owner: string) {
        const result = await this.codeChunksCollection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
            ),
        });
        return result.objects;
    }

    async findByOwnerRepo(owner: string, repo: string) {
        const result = await this.codeChunksCollection.query.fetchObjects({
            filters: Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
                this.codeChunksCollection.filter.byProperty('repo').equal(repo),
            ),
        });
        return result.objects;
    }

    async findByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
        const result = await this.codeChunksCollection.query.fetchObjects({
            returnMetadata: "all",
            filters: Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
                this.codeChunksCollection.filter.byProperty('repo').equal(repo),
                this.codeChunksCollection.filter.byProperty('filePath').equal(filePath),
            ),
        });
        return result.objects;
    }

    async deleteByOwnerRepoFilePath(owner: string, repo: string, filePath: string) {
        return await this.codeChunksCollection.data.deleteMany(
            Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
                this.codeChunksCollection.filter.byProperty('repo').equal(repo),
                this.codeChunksCollection.filter.byProperty('filePath').equal(filePath),
            ),
        );
    }

    async deleteByOwnerRepo(owner: string, repo: string) {
        return await this.codeChunksCollection.data.deleteMany(
            Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
                this.codeChunksCollection.filter.byProperty('repo').equal(repo),
            ),
        );
    }

    async deleteByOwner(owner: string) {
        return await this.codeChunksCollection.data.deleteMany(
            Filters.and(
                this.codeChunksCollection.filter.byProperty('owner').equal(owner),
            ),
        );
    }



    async insert(content: string, owner: string, repo: string, filePath: string) {
        return await this.codeChunksCollection.data.insert({
            content: content,
            owner: owner,
            repo: repo,
            filePath: filePath,
        });
    }

    async search(content: string, filters){
        const { limit, fields } = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? ['content', 'owner', 'repo', 'filePath'];

        const result = await this.codeChunksCollection.query.nearText(content, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });
        return result.objects;
    }

}