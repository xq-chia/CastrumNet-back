import { Module } from '@nestjs/common';
import { RoleAssignmentService } from './role_assignment.service';
import { DbModule } from 'src/db/db.module';
import { RoleAssignmentController } from './role_assignment.controller';

@Module({
  imports: [DbModule],
  providers: [RoleAssignmentService],
  exports: [RoleAssignmentService],
  controllers: [RoleAssignmentController]
})
export class RoleAssignmentModule {}
