import { Module } from '@nestjs/common';
import { HostAssignmentController } from './host_assignment.controller';
import { HostAssignmentService } from './host_assignment.service';
import { DbModule } from 'src/db/db.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DbModule],
  controllers: [HostAssignmentController],
  providers: [HostAssignmentService, UsersService],
  exports: [HostAssignmentService]
})
export class HostAssignmentModule {}
