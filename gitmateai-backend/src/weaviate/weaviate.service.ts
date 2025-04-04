import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import weaviate from 'weaviate-client';
import schemas from './schema'

@Injectable()
export class WeaviateService implements OnModuleInit {
    private client: any;
    private readonly logger = new Logger(WeaviateService.name);

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit() {
        const url = this.configService.get<string>("DATABASE_URL") || 'http://localhost:8080';
        try {
            const parsedUrl = new URL(url);
            const host = parsedUrl.hostname;
            const port =  parseInt(parsedUrl.port, 10);
            this.client = await weaviate.connectToLocal({
                host: host,
                port: port,
            })
        } catch (error) {
            throw new Error(`Invalid URL: ${url}`);
        }
        await this.client.isReady();
        await this.initializeCollections();
    }

    private async initializeCollections() {
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