import { Test, TestingModule } from '@nestjs/testing';
import { RoleAssignmentController } from './role_assignment.controller';

describe('RoleAssignmentController', () => {
  let controller: RoleAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAssignmentController],
    }).compile();

    controller = module.get<RoleAssignmentController>(RoleAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
