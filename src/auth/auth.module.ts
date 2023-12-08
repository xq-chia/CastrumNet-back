import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { jwtConstants } from "../constants/jwt.constant";
import { JwtModule } from "@nestjs/jwt";
import { DbModule } from 'src/db/db.module';
import { TenantsModule } from 'src/tenants/tenants.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    UsersModule,
    TenantsModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    }),
    DbModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LoggerService]
})
export class AuthModule {}
