import { Module } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { RbacModule } from 'src/rbac/rbac.module';
import { HostService } from 'src/host/host.service';
import { DbModule } from 'src/db/db.module';
import { LoggerService } from 'src/logger/logger.service';
import { UserHostService } from 'src/user_host/user_host.service';

@Module({
    imports: [RbacModule, DbModule],
    providers: [CommandGateway, HostService, LoggerService, UserHostService],
    exports: [CommandGateway]
})
export class CommandModule {}
