import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { InitController } from './init/init.controller';
import { InitModule } from './init/init.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    TenantsModule, 
    InitModule
  ],
  controllers: [AppController, InitController],
  providers: [AppService],
})
export class AppModule {}
