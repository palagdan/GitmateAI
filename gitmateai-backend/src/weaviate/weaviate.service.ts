import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import weaviate from 'weaviate-client';
import {
    createCodeChunksSchema,
    createCommitChunksSchema,
    createConventionChunkSchema,
    createIssueChunkSchema
} from "./schema";


@Injectable()
export class WeaviateService implements OnModuleInit {
    private client: any;
    private readonly logger = new Logger(WeaviateService.name);

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit() {

        const host = this.configService.get<string>("DATABASE_HOST") || 'localhost';
        const port = this.configService.get<string>("DATABASE_PORT") || '8080';
        this.client = await weaviate.connectToCustom({
                httpHost: host,
                httpPort: parseInt(port),
                httpSecure: false,
                grpcHost: host,
                grpcPort: 50051,
                grpcSecure: false,
        })

        await this.client.isReady();
        await this.initializeCollections();
    }

    private async initializeCollections() {

        const config = {
            ollamaUrl: this.configService.get<string>('OLLAMA_URL', 'http://ollama:11434'),
            ollamaEmbeddingModel: this.configService.get<string>('OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text'),
        };

        const schemas = [
            createIssueChunkSchema(config),
            createCodeChunksSchema(config),
            createConventionChunkSchema(config),
            createCommitChunksSchema(config),
        ];

        for (const schema of schemas) {
            try {
                const collectionExists = await this.client.collections.exists(schema.name);
                if (!collectionExists) {
                    await this.client.collections.create(schema);
                    this.logger.log(`Collection "${schema.name}" created successfully.`);
                } else {
                    this.logger.log(`Collection "${schema.name}" already exists.`);
                }
            } catch (error) {
                this.logger.error('Error initializing collections:', error);
                throw error;
            }
        }
    }

    getClient() {
        return this.client;
    }
}