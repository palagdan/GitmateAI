import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";
import {ConventionChunk} from "./types";
import {Filters} from "weaviate-client";

@Injectable()
export class ConventionChunksRepository implements OnModuleInit {

    private conventionChunksCollection: any;

    constructor(private readonly weaviateService: WeaviateService) {
    }

    async onModuleInit() {
        this.conventionChunksCollection = this.weaviateService.getClient().collections.get('ConventionChunks');
    }

   async findAll() {
       const result = await this.conventionChunksCollection.query.fetchObjects({
           returnMetadata: "all"
       })
       return result.objects;
   }

   async deleteAll() {
       await this.weaviateService.getClient().collections.deleteMany(
           this.findAll()
       );
   }

    async insert(conventionChunk: ConventionChunk) {
        const { content, source } = conventionChunk;
        return await this.conventionChunksCollection.data.insert({
            content: content,
            source: source
        });
    }

    async search(content: string, filters){
        const { limit, fields } = filters;
        const finalLimit = limit ?? 10;
        const returnProperties = fields ?? ['content'];

        const result = await this.conventionChunksCollection.query.nearText(content, {
            returnProperties: returnProperties,
            limit: finalLimit,
            returnMetadata: "all"
        });
        return result.objects;
    }

    async findBySource(source: string) {
        const result = await this.conventionChunksCollection.query.fetchObjects({
            filters: Filters.and(
                this.conventionChunksCollection.filter.byProperty('source').equal(source)
            ),
            returnMetadata: "all"
        })
        return result.objects;
    }

    async deleteBySource(source: string) {
        const result = await this.conventionChunksCollection.query.deleteMany({
            filters: Filters.and(
                this.conventionChunksCollection.filter.byProperty('source').equal(source)
            ),
            returnMetadata: "all"
        })
        return result.objects;
    }
}
