import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import weaviate, {vectorizer} from 'weaviate-client';

@Injectable()
export class WeaviateService implements OnModuleInit {
    private client: any;
    private readonly logger = new Logger(WeaviateService.name);

    constructor(private readonly configService: ConfigService) {
    }


    private schemas = [
        {
            name: "IssueChunks",
            properties: [
                {"name": "content", "dataType": "text"},
                {"name": "owner", "dataType": "text", "skipVectorization": true},
                {"name": "repo", "dataType": "text", "skipVectorization": true},
                {"name": "issue", "dataType": "int", "skipVectorization": true}
            ],
        },
        {
            name: "CodeChunks",
            properties: [
                {"name": "content", "dataType": "text"},
                {"name": "owner", "dataType": "text", "skipVectorization": true},
                {"name": "repo", "dataType": "text", "skipVectorization": true},
                {"name": "filePath", "dataType": "text", "skipVectorization": true},
            ],
        },

        {
            name: "ConventionChunks",
            properties: [
                {"name": "content", "dataType": "text"},
            ],
        }
    ]

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

        for (const schema of this.schemas) {
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