import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { InitModule } from './init/init.module';
import { CommandModule } from './command/command.module';
import { RbacModule } from './rbac/rbac.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    TenantsModule, 
    InitModule, 
    CommandModule, 
    RbacModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
