import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { EditHostAssignmentDto } from 'src/dto/edit-hostAssignment.dto';
import { User } from 'src/entity/user.entity';
import { UserHost } from 'src/entity/user_host.entity';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { UsersService } from 'src/users/users.service';

@Controller('hostAssignment')
export class HostAssignmentController {
    constructor(
        private userService: UsersService,
        private userHostService: UserHostService,
        private roleAssignmentService: RoleAssignmentService
    ) {}

    @Get()
    async fetchAll() {
        let users: User[];
        let ret: any[] = [];

        users = await this.userService.findAll()
        for (const user of users) {
            ret.push({ userId: user.userId, username: user.username });
        }

        return ret;
    }

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
