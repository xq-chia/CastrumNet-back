import { Module } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { DbModule } from 'src/db/db.module';
import { UserHostController } from './user_host.controller';
import { HostService } from 'src/host/host.service';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DbModule],
  providers: [UserHostService, HostService, LoggerService, UsersService],
  exports: [UserHostService],
  controllers: [UserHostController]
})
export class UserHostModule {}
