import { Module } from '@nestjs/common';
import { HostController } from './host.controller';
import { HostService } from './host.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [HostController],
  providers: [HostService],
  exports: [HostService],
  imports: [DbModule]
})
export class HostModule {}
