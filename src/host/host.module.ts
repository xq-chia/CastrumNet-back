import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { DbModule } from 'src/db/db.module';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [HostController],
  providers: [HostService, LoggerService, UsersService],
  exports: [HostService],
  imports: [DbModule]
})
export class HostModule {}
