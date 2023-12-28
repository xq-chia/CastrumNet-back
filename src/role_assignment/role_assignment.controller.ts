import { Body, Controller, Get, Patch, Param, UseInterceptors, UseFilters } from '@nestjs/common';
import { EditRoleAssignmentDto } from 'src/dto/edit-roleAssignment.dto';
import { RoleAssignmentService } from './role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { UsersService } from 'src/users/users.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { UserHostService } from 'src/user_host/user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { Host } from 'src/entity/host.entity';
import { HostService } from 'src/host/host.service';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/entity/role.entity';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('roleAssignment')
export class RoleAssignmentController {
  constructor(
      private roleAssignmentService: RoleAssignmentService,
      private userHostService: UserHostService,
      private hostService: HostService,
      private roleSrv: RoleService
      
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
      let roles: Role[] = [];

      host = await this.hostService.findOneByHostId(userHost.hostId);
      _roleAssignments = await this.roleAssignmentService.findAllByUserHostId(userHost.userHostId);
      roleIds = _roleAssignments.map(val => val.roleId);

      for (const roleId of roleIds) {
        let role: Role;
        role = await this.roleSrv.findOneByRoleId(roleId)
        roles.push(role);
      }

      roleAssignments.push({ host: host.host, ipAddress: host.ipAddress, userHostId: userHost.userHostId, roleIds: roleIds, roles});
    }

    return {
      msg: `Successfully fetched role assignments for user ${userId}`,
      roleAssignments
    };
  }

  @Patch()
  async edit(@Body() dto: EditRoleAssignmentDto) {
      for (const roleAssignment of dto.roleAssignments) {
        let toAdd: number[] = [];
        let toDelete: RoleAssignment[] = [];
        let roleAssignments: RoleAssignment[] = [];
        let _roleIds: number[] = [];
        let roleIds: number[] = [];

        roleAssignments = await this.roleAssignmentService.findAllByUserHostId(roleAssignment.userHostId)
        roleIds = roleAssignment.roleIds
        _roleIds = roleAssignments.map(roleAssignment => roleAssignment.roleId)

        toAdd = roleIds.filter(roleId => !_roleIds.includes(roleId))
        toDelete = roleAssignments.filter(_roleAssignment => !roleIds.includes(_roleAssignment.roleId))

        for (const roleId of toAdd) {
          let _roleAssignment: RoleAssignment;
          _roleAssignment = new RoleAssignment(roleAssignment.userHostId, roleId);
          await this.roleAssignmentService.save(_roleAssignment);
        }

        for (const roleAssignment of toDelete) {
          this.roleAssignmentService.delete(roleAssignment)
        }
      }
    return {
      msg: `Successfully edited role for user ${dto.userId}`
    }
  }
}
