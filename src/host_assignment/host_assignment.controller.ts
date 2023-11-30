import { Body, Controller, Get, Param, Patch, UseInterceptors } from '@nestjs/common';
import { EditHostAssignmentDto } from 'src/dto/edit-hostAssignment.dto';
import { User } from 'src/entity/user.entity';
import { UserHost } from 'src/entity/user_host.entity';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { UsersService } from 'src/users/users.service';

@UseInterceptors(TransformInterceptor)
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

        return { userHosts: userHosts };
    }

    @Patch('/:userId')
    async edit(@Body() dto: EditHostAssignmentDto, @Param('userId') userId: number) {
        for (const userHost of dto.userHosts) {
            this.roleAssignmentService.deleteAllByUserHostId(userHost.userHostId);
        }
        await this.userHostService.deleteAllByUserId(userId);
        for (const hostId of dto.hostIds) {
            this.userHostService.save(new UserHost(userId, hostId))
        }
    }
}
