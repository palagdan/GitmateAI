import { Test, TestingModule } from '@nestjs/testing';
import { CodeChunksService } from './code-chunks.service';

describe('CodeChunksService', () => {
  let service: CodeChunksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeChunksService],
    }).compile();

    service = module.get<CodeChunksService>(CodeChunksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
