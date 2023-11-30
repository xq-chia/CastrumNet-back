import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { Host } from 'src/entity/host.entity';
import { HostService } from 'src/host/host.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('userHost')
export class UserHostController {
    constructor(
        private userHostSrv: UserHostService,
        private hostSrv: HostService
    ) {}

    @Get(':userId')
    async fetch(@Param('userId') userId: number) {
        let userHosts: UserHost[];
        let ret: any[] = [];

        userHosts = await this.userHostSrv.findAllByUserId(userId);

        for (const userHost of userHosts) {
            let host: Host;

            host = await this.hostSrv.findOneByHostId(userHost.hostId);

            ret.push({
                userId: userHost.userId,
                userHostId: userHost.userHostId,
                host: {
                    hostId: host.hostId,
                    host: host.host,
                    ipAddress: host.ipAddress
                }
            })
        }

        return ret;
    }
}