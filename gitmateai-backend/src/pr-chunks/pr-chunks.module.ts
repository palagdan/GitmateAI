import {Module} from "@nestjs/common";
import {WeaviateModule} from "../weaviate/weaviate.module";
import {PRChunksController} from "./pr-chunks.controller";
import {PRChunksService} from "./pr-chunks.service";
import {PRChunksRepository} from "./pr-chunks.repository";


@Module({
    imports: [WeaviateModule],
    controllers: [PRChunksController],
    providers: [PRChunksService, PRChunksRepository],
})
export class PRChunksModule {}