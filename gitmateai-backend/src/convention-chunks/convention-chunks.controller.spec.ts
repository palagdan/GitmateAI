import { Test, TestingModule } from '@nestjs/testing';
import { ConventionChunksController } from './convention-chunks.controller';

describe('ConventionChunksController', () => {
  let controller: ConventionChunksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConventionChunksController],
    }).compile();

    controller = module.get<ConventionChunksController>(ConventionChunksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
