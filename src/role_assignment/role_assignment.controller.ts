import { Body, Controller, Get, Patch, Param, UseInterceptors } from '@nestjs/common';
import { EditRoleAssignmentDto } from 'src/dto/edit-roleAssignment.dto';
import { RoleAssignmentService } from './role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { UserHostService } from 'src/user_host/user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { Host } from 'src/entity/host.entity';
import { HostService } from 'src/host/host.service';

@UseInterceptors(TransformInterceptor)
@Controller('roleAssignment')
export class RoleAssignmentController {
  constructor(
      private roleAssignmentService: RoleAssignmentService,
      private userService: UsersService,
      private userHostService: UserHostService,
      private hostService: HostService
  ) {}

  @Get(':userId')
  async fetch(@Param('userId') userId: number) {
    let roleAssignments: any[] = [];
    let userHosts: UserHost[] = [];

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

    return { roleAssignments };
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
