import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
