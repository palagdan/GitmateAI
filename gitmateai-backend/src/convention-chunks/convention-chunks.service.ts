import {Injectable, Logger} from '@nestjs/common';
import {ConventionDto} from "./dto/convention.dto";
import { splitText} from "../utils/llm-utils";
import {ConventionChunksRepository} from "./convention-chunks.repository";
import {SearchConventionChunksDto} from "./dto/search-convention-chunks.dto";

@Injectable()
export class ConventionChunksService {

    private readonly logger = new Logger(ConventionChunksService.name);

    constructor(private readonly repository: ConventionChunksRepository) {}

    async findAll() {
        this.logger.log('Fetching all convention chunks');
        return await this.repository.findAll();
    }

    async deleteAll() {
        this.logger.log('Deleting all convention chunks');
        return await this.repository.deleteAll();
    }

    async insert(contentDto: ConventionDto){
        const { content, source} = contentDto;
        this.logger.log(`Inserting convention chunks`);

        const chunks = await splitText(content);
        this.logger.log(`Split text into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert({
                content: chunk,
                source: source
            });
        }

        this.logger.log('Convention chunks insertion completed');
    }

    async search(searchChunksDto: SearchConventionChunksDto){
        const { content, limit, fields } = searchChunksDto;
        this.logger.log(`Searching convention chunks with limit: ${limit}, fields: ${JSON.stringify(fields)}`);
        const chunkResult: any = await this.repository.search(content, { limit, fields });
        this.logger.log(`Returning ${chunkResult.length} search results`);
        return chunkResult;
    }

    async findBySource(source: string) {
        this.logger.log(`Finding convention chunks by source: ${source}`);
        const result: any = await this.repository.findBySource(source);
        this.logger.log(`Returning ${result.length} convention chunks for source: ${source}`);
        return result;
    }

    async deleteBySource(source: string) {
        this.logger.log(`Deleting convention chunks by source: ${source}`);
        const result: any = await this.repository.deleteBySource(source);
        this.logger.log(`Deleted ${result.length} convention chunks for source: ${source}`);
        return result;
    }
}
