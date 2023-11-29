import { Test, TestingModule } from '@nestjs/testing';
import { UserHostController } from './user_host.controller';

describe('UserHostController', () => {
  let controller: UserHostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHostController],
    }).compile();

    controller = module.get<UserHostController>(UserHostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
