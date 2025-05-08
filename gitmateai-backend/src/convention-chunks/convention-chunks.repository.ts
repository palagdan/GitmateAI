import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";
import {ConventionChunk} from "./types";
import {Filters} from "weaviate-client";

@Injectable()
export class ConventionChunksRepository implements OnModuleInit {

    private collection: any;

    constructor(private readonly weaviateService: WeaviateService) {
    }

    async onModuleInit() {
        this.collection = this.weaviateService.getClient().collections.get('ConventionChunks');
    }

   async findAll() {
       const result = await this.collection.query.fetchObjects({
           returnMetadata: "all"
       })
       return result.objects;
   }

   async deleteAll() {

   }

    async insert(conventionChunk: ConventionChunk) {
        const { content, source } = conventionChunk;
        return await this.collection.data.insert({
            content: content,
            source: source
        });
    }

    async search(content: string, filters){
        const { limit, fields } = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? undefined;

        const result = await this.collection.query.nearText(content, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });
        return result.objects;
    }

    async findBySource(source: string) {
        const result = await this.collection.query.fetchObjects({
            filters: Filters.and(
                this.collection.filter.byProperty('source').equal(source)
            ),
            returnMetadata: "all"
        })
        return result.objects;
    }

    async deleteBySource(source: string) {
        const result = await this.collection.query.deleteMany({
            filters: Filters.and(
                this.collection.filter.byProperty('source').equal(source)
            ),
            returnMetadata: "all"
        })
        return result.objects;
    }
}
