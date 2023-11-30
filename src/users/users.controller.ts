import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from 'src/dto/create-users.dto';
import { User } from 'src/entity/user.entity';
import { Tenant } from 'src/entity/tenant.entity';
import { TenantsService } from 'src/tenants/tenants.service';
import { EditUserDto } from 'src/dto/edit-user.dto';
import { UserHostService } from 'src/user_host/user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { HostService } from 'src/host/host.service';
import { Host } from 'src/entity/host.entity';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { RoleAssignmentService } from 'src/role_assignment/role_assignment.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private userHostService: UserHostService,
    private hostService: HostService,
    private roleAssignmentService: RoleAssignmentService
  ) {}

  @Get()
  fetchAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async fetch(@Param('userId') userId: number) {
    let user: User;
    let tenant: Tenant;
    let userHosts: UserHost[] = [];
    let roleAssignments: any[] = [];
    let ret: any;

    user = await this.usersService.findOneById(userId);
    tenant = await this.tenantsService.findOneById(user.tenantId);
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
      user: user,
      tenant: tenant,
      userHosts: userHosts,
      roleAssignments: roleAssignments
    };

    return ret;
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    let user: User;
    let userId: number;

    user = new User(
      createDto.username,
      createDto.password,
      createDto.firstName,
      createDto.lastName,
      true,
      createDto.tenantId,
    );

    userId = await this.usersService.save(user);
    for (const hostId of createDto.hostIds) {
      this.userHostService.save(new UserHost(userId, hostId));
    }
  }

  @Patch(':userId')
  async edit(@Param('userId') userId: number, @Body() dto: EditUserDto) {
    let user: User;

    dto.status = dto.status ?? false;

    user = new User(dto.username, dto.password, dto.firstName, dto.lastName, dto.status, dto.tenantId, userId)

    this.usersService.update(user);
  }

  @Patch('freeze/:userId')
  async freeze(@Param('userId') userId: number) {
    return await this.usersService.updateStatus(userId);
  }

  @Delete(':userId')
    async delete(@Param('userId') userId: number) {
      await this.usersService.deleteByUserId(userId);
    }
}
