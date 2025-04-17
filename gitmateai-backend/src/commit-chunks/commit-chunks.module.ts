import { Module } from '@nestjs/common';
import { CommitChunksController } from './commit-chunks.controller';
import { CommitChunksService } from './commit-chunks.service';
import {CommitChunksRepository} from "./commit-chunks.repository";
import {WeaviateModule} from "../weaviate/weaviate.module";

@Module({
    controllers: [CommitChunksController],
    providers: [CommitChunksService, CommitChunksRepository],
    imports: [WeaviateModule],
})
export class CommitChunksModule {}