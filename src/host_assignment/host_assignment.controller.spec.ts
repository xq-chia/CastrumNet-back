import { Test, TestingModule } from '@nestjs/testing';
import { HostAssignmentController } from './host_assignment.controller';

describe('HostAssignmentController', () => {
  let controller: HostAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostAssignmentController],
    }).compile();

    controller = module.get<HostAssignmentController>(HostAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
