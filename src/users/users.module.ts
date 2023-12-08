import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbModule } from 'src/db/db.module';
import { UsersController } from './users.controller';
import { TenantsService } from 'src/tenants/tenants.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { HostService } from 'src/host/host.service';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  providers: [UsersService, TenantsService, UserHostService, HostService, RoleAssignmentService, LoggerService],
  exports: [UsersService],
  imports: [DbModule],
  controllers: [UsersController]
})
export class UsersModule {}
