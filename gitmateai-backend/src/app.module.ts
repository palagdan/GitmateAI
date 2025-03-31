import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeaviateModule } from './weaviate/weaviate.module';
import {IssueChunksModule} from "./issue-chunks/issue-chunks.module";
import {ConfigModule} from "@nestjs/config";
import { CodeChunksModule } from './code-chunks/code-chunks.module';

@Module({
  imports: [WeaviateModule, CodeChunksModule ,IssueChunksModule, ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
  ), CodeChunksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
