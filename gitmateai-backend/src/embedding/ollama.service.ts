import { Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class OllamaService {

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {

    }

    async embed(content: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    this.configService.get<string>("OLLAMA_URL") + "/api/embed" || 'http://host.docker.internal:11434' + "/api/embed",
                    {
                        model: this.configService.get<string>("OLLAMA_EMBEDDING_MODEL") || 'nomic-embed-text',
                        input: content,
                    },
                )
            );
            return response.data.embeddings[0];
        } catch (error) {
            throw new Error(`Failed to generate embedding: ${error.message}`);
        }

    }
}