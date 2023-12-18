import { Controller, Get, Param, UseFilters, UseInterceptors } from '@nestjs/common';
import { UserHostService } from './user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { Host } from 'src/entity/host.entity';
import { HostService } from 'src/host/host.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('userHost')
export class UserHostController {
    constructor(
        private userHostSrv: UserHostService,
        private hostSrv: HostService
    ) {}

    @Get(':userId')
    async fetch(@Param('userId') userId: number) {
        let _userHosts: UserHost[];
        let workstations: any[] = [];

        _userHosts = await this.userHostSrv.findAllByUserId(userId);

        for (const userHost of _userHosts) {
            let host: Host;

            host = await this.hostSrv.findOneByHostId(userHost.hostId);

            workstations.push({
                userId: userHost.userId,
                userHostId: userHost.userHostId,
                host: {
                    hostId: host.hostId,
                    host: host.host,
                    ipAddress: host.ipAddress
                }
            })
        }

        return {
            msg: `Successfully fetched workstation for user ${userId}`,
            workstations
        }
    }
}
