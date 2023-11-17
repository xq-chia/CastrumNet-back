import { Test, TestingModule } from '@nestjs/testing';
import { UserHostService } from './user_host.service';

describe('UserHostService', () => {
  let service: UserHostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHostService],
    }).compile();

    service = module.get<UserHostService>(UserHostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
