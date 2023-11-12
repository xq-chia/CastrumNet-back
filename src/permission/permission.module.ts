import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { PermissionService } from './permission.service';

@Module({
    imports: [DbModule],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}
