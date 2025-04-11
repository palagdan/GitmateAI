import {Injectable, OnModuleInit} from "@nestjs/common";
import {WeaviateService} from "../weaviate/weaviate.service";

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

    async insert(content: string) {
        return await this.conventionChunksCollection.data.insert({
            content: content,
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
}
