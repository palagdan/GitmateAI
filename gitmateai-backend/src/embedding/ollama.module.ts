import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {OllamaService} from "./ollama.service";
import {ConfigModule} from "@nestjs/config";


@Module({
    imports: [HttpModule, ConfigModule],
    providers: [OllamaService],
    exports: [OllamaService],
})
export class OllamaModule {}