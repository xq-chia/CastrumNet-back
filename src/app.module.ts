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
import { RoleInheritanceModule } from './role_inheritance/role_inheritance.module';
import { HostModule } from './host/host.module';

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
    HostModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
