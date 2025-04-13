import { Module } from '@nestjs/common';
import { ConventionChunksController } from './convention-chunks.controller';
import { ConventionChunksService } from './convention-chunks.service';
import {ConventionChunksRepository} from "./convention-chunks.repository";
import {WeaviateModule} from "../weaviate/weaviate.module";

@Module({
  imports: [WeaviateModule],
  controllers: [ConventionChunksController],
  providers: [ConventionChunksService, ConventionChunksRepository]
})
export class ConventionChunksModule {}
