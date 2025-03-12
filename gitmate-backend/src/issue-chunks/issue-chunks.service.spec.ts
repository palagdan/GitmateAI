import { Test, TestingModule } from '@nestjs/testing';
import { IssueChunksService } from './issue-chunks.service';

describe('IssueChunksService', () => {
  let service: IssueChunksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueChunksService],
    }).compile();

    service = module.get<IssueChunksService>(IssueChunksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
