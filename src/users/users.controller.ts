import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from 'src/dto/create-users.dto';
import { User } from 'src/entity/user.entity';
import { Tenant } from 'src/entity/tenant.entity';
import { TenantsService } from 'src/tenants/tenants.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
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
  async create(@Body() createDto: CreateDto): Promise<boolean> {
    let user: User;

    user = new User(
      createDto.userId,
      createDto.username,
      createDto.password,
      createDto.firstName,
      createDto.lastName,
      createDto.tenantId,
    );

    return await this.usersService.save(user);
  }

  @Patch('freeze/:userId')
  async freeze(@Param('userId') userId: any) {
    return await this.usersService.updateStatus(userId);
  }
}
