import { Module } from '@nestjs/common';
import { ConventionChunksController } from './convention-chunks.controller';
import { ConventionChunksService } from './convention-chunks.service';
import {ConventionChunksRepository} from "./convention-chunks.repository";
import {WeaviateModule} from "../weaviate/weaviate.module";
import {OllamaModule} from "../embedding/ollama.module";

@Module({
  imports: [WeaviateModule, OllamaModule],
  controllers: [ConventionChunksController],
  providers: [ConventionChunksService, ConventionChunksRepository]
})
export class ConventionChunksModule {}
