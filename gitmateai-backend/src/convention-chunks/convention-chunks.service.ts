import {Injectable, Logger} from '@nestjs/common';
import {ContentDto} from "../common/dto/content.dto";
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

    async insert(contentDto: ContentDto){
        const { content} = contentDto;
        this.logger.log(`Inserting convention chunks`);

        const chunks = await splitText(content);
        this.logger.log(`Split text into ${chunks.length} chunks`);

        for (const chunk of chunks) {
            await this.repository.insert(chunk);
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

}
