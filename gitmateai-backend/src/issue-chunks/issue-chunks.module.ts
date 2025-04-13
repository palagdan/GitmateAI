import { Module } from '@nestjs/common';
import {IssueChunksController} from './issue-chunks.controller';

import {WeaviateModule} from "../weaviate/weaviate.module";
import {IssueChunksService} from "./issue-chunks.service";
import {IssueChunksRepository} from "./issue-chunks.repository";


@Module({
  imports: [WeaviateModule],
  controllers: [IssueChunksController],
  providers: [IssueChunksService, IssueChunksRepository],
})
export class IssueChunksModule {}
