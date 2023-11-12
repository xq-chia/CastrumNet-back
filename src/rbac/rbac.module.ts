import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { DbModule } from 'src/db/db.module';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [DbModule],
  providers: [RbacService, PermissionService],
  exports: [RbacService],
})
export class RbacModule {}