import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { DbModule } from 'src/db/db.module';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [DbModule],
  providers: [TenantsService],
  exports: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
