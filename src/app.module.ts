import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { InitModule } from './init/init.module';
import { CommandModule } from './command/command.module';
import { RbacModule } from './rbac/rbac.module';
import { RoleModule } from './role/role.module';
import { RoleInheritanceService } from './role_inheritance/role_inheritance.service';
import { RoleInheritanceModule } from './role_inheritance/role_inheritance.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    TenantsModule, 
    InitModule, 
    CommandModule, 
    RbacModule, 
    RoleModule, 
    RoleInheritanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
