import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [InitController],
})
export class InitModule {}
