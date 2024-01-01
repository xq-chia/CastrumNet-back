import { Body, Controller, Get, Param, Patch, UseFilters, UseInterceptors } from '@nestjs/common';
import { EditHostAssignmentDto } from 'src/dto/edit-hostAssignment.dto';
import { User } from 'src/entity/user.entity';
import { UserHost } from 'src/entity/user_host.entity';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { UsersService } from 'src/users/users.service';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('hostAssignment')
export class HostAssignmentController {
    constructor(
        private userService: UsersService,
        private userHostService: UserHostService,
        private roleAssignmentService: RoleAssignmentService
    ) {}

    @Get('/:userId')
    async fetch(@Param('userId') userId: number) {
        let userHosts: UserHost[]

        userHosts = await this.userHostService.findAllByUserId(userId)

        return {
            msg: `Succcessfully fetched hosts for user ${userId}`,
            userHosts
        };
    }

    @Patch('/:userId')
    async edit(@Body() dto: EditHostAssignmentDto, @Param('userId') userId: number) {
        let userHosts: UserHost[] = [];
        let hostIds: number[] = [];
        let toAdd: number[] = [];
        let toDelete: UserHost[] = [];

        userHosts = await this.userHostService.findAllByUserId(userId)
        hostIds = userHosts.map(userHost => userHost.hostId);
        toAdd = dto.hostIds.filter(hostId => hostIds.indexOf(hostId) < 0)
        toDelete = userHosts.filter(userHost => dto.hostIds.indexOf(userHost.hostId) < 0)

        for (const hostId of toAdd) {
            let userHost: UserHost;
            userHost = new UserHost(userId, hostId);
            this.userHostService.save(userHost);
        }

        for (const userHost of toDelete) {
            this.userHostService.delete(userHost);
        }

        return {
            msg: `Successfully edited host assignment for user ${userId}`
        }
    }
}
