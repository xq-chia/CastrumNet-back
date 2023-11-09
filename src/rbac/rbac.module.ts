import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}