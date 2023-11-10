import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { RoleInheritanceService } from './role_inheritance.service';

@Module({
    imports: [DbModule],
    providers: [RoleInheritanceService],
    exports: [RoleInheritanceService]
})
export class RoleInheritanceModule {}
