import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [DbModule],
  providers: [RoleService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
