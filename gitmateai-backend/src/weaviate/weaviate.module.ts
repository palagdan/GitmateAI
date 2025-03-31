import { Module } from '@nestjs/common';
import { WeaviateService } from './weaviate.service';

@Module({
  providers: [WeaviateService],
  exports: [WeaviateService],
})
export class WeaviateModule {}
