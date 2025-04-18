import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeaviateModule } from './weaviate/weaviate.module';
import {IssueChunksModule} from "./issue-chunks/issue-chunks.module";
import {ConfigModule} from "@nestjs/config";
import { CodeChunksModule } from './code-chunks/code-chunks.module';
import { ConventionChunksModule } from './convention-chunks/convention-chunks.module';
import {CommitChunksModule} from "./commit-chunks/commit-chunks.module";

@Module({
  imports: [WeaviateModule, CodeChunksModule ,IssueChunksModule, CommitChunksModule,ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
  ), CodeChunksModule, ConventionChunksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
