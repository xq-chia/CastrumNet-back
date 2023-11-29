import { Controller, Get, Param } from '@nestjs/common';
import { UserHostService } from './user_host.service';

@Controller('userHost')
export class UserHostController {
    constructor(private userHostSrv: UserHostService) {}

    @Get(':userId')
    async fetch(@Param('userId') userId: number) {
        return await this.userHostSrv.findAllByUserId(userId);
    }
}
