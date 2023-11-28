import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AccountingInterceptor } from './accounting.interceptor';
import { DbModule } from 'src/db/db.module';

@Module({
    imports: [DbModule],
    providers: [AccountingInterceptor, JwtService, UsersService],
    exports: [AccountingInterceptor]
})
export class AccountingModule {}
