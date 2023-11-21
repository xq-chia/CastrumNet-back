import { Module } from '@nestjs/common';
import { HostAssignmentController } from './host_assignment.controller';
import { HostAssignmentService } from './host_assignment.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [HostAssignmentController],
  providers: [HostAssignmentService],
  exports: [HostAssignmentService]
})
export class HostAssignmentModule {}
