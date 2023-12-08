import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { UsersModule } from 'src/users/users.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    imports: [UsersModule],
    controllers: [InitController],
    providers: [LoggerService]
})
export class InitModule {}
