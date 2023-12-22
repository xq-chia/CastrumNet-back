import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { DbModule } from 'src/db/db.module';
import { TenantsController } from './tenants.controller';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DbModule],
  providers: [TenantsService, LoggerService, UsersService],
  exports: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
