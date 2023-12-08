import { Module } from '@nestjs/common';
import { RoleAssignmentService } from './role_assignment.service';
import { DbModule } from 'src/db/db.module';
import { RoleAssignmentController } from './role_assignment.controller';
import { UsersService } from 'src/users/users.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { HostService } from 'src/host/host.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [DbModule],
  providers: [RoleAssignmentService, UsersService, UserHostService, HostService, LoggerService],
  exports: [RoleAssignmentService],
  controllers: [RoleAssignmentController]
})
export class RoleAssignmentModule {}
