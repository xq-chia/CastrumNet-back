import { Module } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { DbModule } from 'src/db/db.module';
import { UserHostController } from './user_host.controller';

@Module({
  imports: [DbModule],
  providers: [UserHostService],
  exports: [UserHostService],
  controllers: [UserHostController]
})
export class UserHostModule {}
