import { Test, TestingModule } from '@nestjs/testing';
import { HostAssignmentService } from './host_assignment.service';

describe('HostAssignmentService', () => {
  let service: HostAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HostAssignmentService],
    }).compile();

    service = module.get<HostAssignmentService>(HostAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
