import { Module } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { RbacModule } from 'src/rbac/rbac.module';

@Module({
    imports: [RbacModule],
    providers: [CommandGateway],
    exports: [CommandGateway]
})
export class CommandModule {}
