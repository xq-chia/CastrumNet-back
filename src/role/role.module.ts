import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { PermissionService } from 'src/permission/permission.service';
import { LoggerService } from 'src/logger/logger.service';
import { FileService } from 'src/file/file.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DbModule],
  providers: [RoleService, RoleInheritanceService, PermissionService, LoggerService, FileService, UsersService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
