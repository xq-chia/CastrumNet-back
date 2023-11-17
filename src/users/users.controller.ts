import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from 'src/dto/create-users.dto';
import { User } from 'src/entity/user.entity';
import { Tenant } from 'src/entity/tenant.entity';
import { TenantsService } from 'src/tenants/tenants.service';
import { EditUserDto } from 'src/dto/edit-user.dto';
import { UserHostService } from 'src/user_host/user_host.service';
import { UserHost } from 'src/entity/user_host.entity';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private userHostService: UserHostService
  ) {}

  @Get()
  fetchAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async fetch(@Param('userId') userId: number) {
    let user: User;
    let tenant: Tenant;
    let ret: any;

    user = await this.usersService.findOneById(userId);
    tenant = await this.tenantsService.findOneById(user.tenantId);

    ret = {
      user: user,
      tenant: tenant
    };

    return ret;
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    let user: User;
    let userId: number;

    user = new User(
      0,
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

    if (!dto.status) dto.status = false;

    user = new User(dto.userId, dto.username, dto.password, dto.firstName, dto.lastName, dto.status, dto.tenantId)

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
