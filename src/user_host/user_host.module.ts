import { Module } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { DbModule } from 'src/db/db.module';
import { UserHostController } from './user_host.controller';
import { HostService } from 'src/host/host.service';

@Module({
  imports: [DbModule],
  providers: [UserHostService, HostService],
  exports: [UserHostService],
  controllers: [UserHostController]
})
export class UserHostModule {}
