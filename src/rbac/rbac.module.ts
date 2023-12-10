import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { DbModule } from 'src/db/db.module';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';

@Module({
  imports: [DbModule],
  providers: [RbacService, PermissionService, RoleService, RoleInheritanceService, RoleAssignmentService],
  exports: [RbacService],
})
export class RbacModule {}