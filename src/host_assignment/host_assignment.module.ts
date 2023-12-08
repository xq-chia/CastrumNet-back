import { Module } from '@nestjs/common';
import { HostAssignmentController } from './host_assignment.controller';
import { HostAssignmentService } from './host_assignment.service';
import { DbModule } from 'src/db/db.module';
import { UsersService } from 'src/users/users.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [DbModule],
  controllers: [HostAssignmentController],
  providers: [HostAssignmentService, UsersService, UserHostService, RoleAssignmentService, LoggerService],
  exports: [HostAssignmentService]
})
export class HostAssignmentModule {}
