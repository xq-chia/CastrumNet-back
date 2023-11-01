import { Test, TestingModule } from '@nestjs/testing';
import { CommandGateway } from './command.gateway';

describe('CommandGateway', () => {
  let gateway: CommandGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandGateway],
    }).compile();

    gateway = module.get<CommandGateway>(CommandGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
