import { Module } from '@nestjs/common';
import {WeaviateModule} from "../weaviate/weaviate.module";
import {CodeChunksController} from "./code-chunks.controller";
import {CodeChunksService} from "./code-chunks.service";
import {CodeChunksRepository} from "./code-chunks.repository";
import {OllamaModule} from "../embedding/ollama.module";

@Module({
    imports: [WeaviateModule, OllamaModule],
    controllers: [CodeChunksController],
    providers: [CodeChunksService, CodeChunksRepository],
})
export class CodeChunksModule {}
