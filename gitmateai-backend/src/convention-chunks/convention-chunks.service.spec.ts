import { Test, TestingModule } from '@nestjs/testing';
import { ConventionChunksService } from './convention-chunks.service';

describe('ConventionChunksService', () => {
  let service: ConventionChunksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConventionChunksService],
    }).compile();

    service = module.get<ConventionChunksService>(ConventionChunksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
