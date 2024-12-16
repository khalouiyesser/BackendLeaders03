import { Test, TestingModule } from '@nestjs/testing';
import { PostulerService } from './postuler.service';

describe('PostulerService', () => {
  let service: PostulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostulerService],
    }).compile();

    service = module.get<PostulerService>(PostulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
