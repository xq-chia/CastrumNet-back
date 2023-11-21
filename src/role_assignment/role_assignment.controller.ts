import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { EditRoleAssignmentDto } from 'src/dto/edit-roleAssignment.dto';
import { RoleAssignmentService } from './role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';
import { UserHost } from 'src/entity/user_host.entity';
import { UserHostService } from 'src/user_host/user_host.service';
import { Host } from 'src/entity/host.entity';
import { HostService } from 'src/host/host.service';

@Controller('roleAssignment')
export class RoleAssignmentController {

    constructor(
        private roleAssignmentService: RoleAssignmentService,
        private userService: UsersService,
        private userHostService: UserHostService,
        private hostService: HostService
    ) {}

    @Get()
    async fetchAll() {
        let users: User[];
        let ret: any[] = [];

        users = await this.userService.findAll();
        for (const user of users) {
            ret.push({ userId: user.userId, username: user.username })
        }

        return ret;
    }

  @Get(':userId')
  async fetch(@Param('userId') userId: number) {
    let userHosts: UserHost[] = [];
    let roleAssignments: any[] = [];
    let ret: any;

    userHosts = await this.userHostService.findAllByUserId(userId);
    for (const userHost of userHosts) {
      let host: Host;
      let _roleAssignments: RoleAssignment[];
      let roleIds: number[];

      host = await this.hostService.findOneByHostId(userHost.hostId);
      _roleAssignments = await this.roleAssignmentService.findAllByUserHostId(userHost.userHostId);
      roleIds = _roleAssignments.map(val => val.roleId);

      roleAssignments.push({ host: host.host, ipAddress: host.ipAddress, userHostId: userHost.userHostId, roleIds: roleIds });
    }

    ret = {
      userHosts: userHosts,
      roleAssignments: roleAssignments
    };

    return ret;
  }

    @Patch()
    edit(@Body() dto: EditRoleAssignmentDto) {
        for (const roleAssignment of dto.roleAssignments) {
            this.roleAssignmentService.deleteAllByUserHostId(roleAssignment.userHostId)
            for (const roleId of roleAssignment.roleIds) {
                this.roleAssignmentService.save(new RoleAssignment(roleAssignment.userHostId, roleId));
            }
        }
    }
}
