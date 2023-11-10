import { Test, TestingModule } from '@nestjs/testing';
import { RoleInheritanceService } from './role_inheritance.service';

describe('RoleInheritanceService', () => {
  let service: RoleInheritanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleInheritanceService],
    }).compile();

    service = module.get<RoleInheritanceService>(RoleInheritanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
