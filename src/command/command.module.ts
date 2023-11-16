import { Module } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { RbacModule } from 'src/rbac/rbac.module';
import { HostService } from 'src/host/host.service';
import { DbModule } from 'src/db/db.module';

@Module({
    imports: [RbacModule, DbModule],
    providers: [CommandGateway, HostService],
    exports: [CommandGateway]
})
export class CommandModule {}
