import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { TenantsService } from "../tenants/tenants.service";
import { User } from 'src/entity/user.entity';
import { Tenant } from 'src/entity/tenant.entity';
import { json } from 'stream/consumers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
    private JwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string | null> {
    let user: User;

    user = await this.authenticate(username, password);

    if (user) {
      return this.signToken(user);
    } else {
      return null;
    }
  }

  private async authenticate(
    username: string,
    password: string,
  ): Promise<User | null> {
    let user: User;

    user = await this.usersService.findOneByUsername(username);

    if (user.username == username && user.password == password) {
      return user;
    } else {
      return null;
    }
  }

  private async signToken(user: User) {
    let payload: any;
    let tenant: Tenant;

    tenant = await this.tenantsService.findOneById(user.tenantId);
    payload = { sub: user.userId, tenant: tenant.role };

    return await this.JwtService.signAsync(payload);
  }
}
