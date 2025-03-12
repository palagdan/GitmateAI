import { Test, TestingModule } from '@nestjs/testing';
import { IssueChunksController } from './issue-chunks.controller';

describe('IssueChunksController', () => {
  let controller: IssueChunksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssueChunksController],
    }).compile();

    controller = module.get<IssueChunksController>(IssueChunksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
