import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UnauthorizedException, UseFilters, UseInterceptors } from '@nestjs/common';
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
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private userHostService: UserHostService,
    private hostService: HostService,
    private roleAssignmentService: RoleAssignmentService
  ) {}

  @Get('/check/:username')
  async checkUsername(@Param('username') username: string) {
    let users: User[];
    let usernames: string[];

    users = await this.usersService.findAll();
    usernames = users.map(user => user.username);

    return usernames.includes(username);
  }

  @Get()
  async fetchAll(): Promise<any> {
    let users: User[];

    users = await this.usersService.findAll();

    return { 
      msg: 'Successfully fetched all users',
      users
    }
  }

  @Get(':userId')
  async fetch(@Param('userId') userId: number) {
    let user: User;
    let tenant: Tenant;
    let userHosts: UserHost[] = [];
    let roleAssignments: any[] = [];

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

    return {
      msg: `Successfully fetched user ${user.userId}`,
      user,
      tenant,
      userHosts,
      roleAssignments
    }
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
      0
    );

    userId = await this.usersService.save(user);
    if (createDto.hostIds) {
      for (const hostId of createDto.hostIds) {
        this.userHostService.save(new UserHost(userId, hostId));
      }
    }
    
    return {
      msg: `Successfully created user ${userId}`
    }
  }

  @Patch(':userId')
  async edit(@Param('userId') userId: number, @Body() dto: EditUserDto) {
    let user: User;

    dto.status = dto.status ?? false;

    user = new User(dto.username, dto.password, dto.firstName, dto.lastName, dto.status, dto.tenantId, userId)

    this.usersService.update(user);

    return {
      msg: `Successfully edited user ${userId}`
    }
  }

  @Patch('status/:userId')
  async freeze(@Param('userId') userId: number) {
    let user: User;
    let msg: string;

    await this.usersService.toggleStatus(userId);
    
    user = await this.usersService.findOneById(userId);

    return {
      msg: `User ${user.userId} has been ${user.status ? 'activated' : 'deactivated'}`
    };
  }

  @Delete(':userId')
    async delete(@Param('userId') userId: number) {
      await this.usersService.deleteByUserId(userId);

      return {
        msg: `Successfully deleted user ${userId}`
      }
    }
}
