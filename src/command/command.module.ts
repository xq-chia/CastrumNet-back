import { Module } from '@nestjs/common';
import { CommandGateway } from './command.gateway';

@Module({
    providers: [CommandGateway],
    exports: [CommandGateway]
})
export class CommandModule {}
