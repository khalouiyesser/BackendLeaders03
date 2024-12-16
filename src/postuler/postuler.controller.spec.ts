import { Test, TestingModule } from '@nestjs/testing';
import { PostulerController } from './postuler.controller';
import { PostulerService } from './postuler.service';

describe('PostulerController', () => {
  let controller: PostulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostulerController],
      providers: [PostulerService],
    }).compile();

    controller = module.get<PostulerController>(PostulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
