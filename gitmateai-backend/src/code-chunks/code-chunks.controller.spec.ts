import { Test, TestingModule } from '@nestjs/testing';
import { CodeChunksController } from './code-chunks.controller';

describe('CodeChunksController', () => {
  let controller: CodeChunksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeChunksController],
    }).compile();

    controller = module.get<CodeChunksController>(CodeChunksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
