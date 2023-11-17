import { Module } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [UserHostService],
  exports: [UserHostService]
})
export class UserHostModule {}
