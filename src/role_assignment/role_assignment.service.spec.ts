import { Test, TestingModule } from '@nestjs/testing';
import { RoleAssignmentService } from './role_assignment.service';

describe('RoleAssignmentService', () => {
  let service: RoleAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAssignmentService],
    }).compile();

    service = module.get<RoleAssignmentService>(RoleAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
