import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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

    return this.signToken(user);
  }

  private async authenticate(
    username: string,
    password: string,
  ): Promise<User> {
    let user: User;

    user = await this.usersService.findOneByUsername(username);

    // user not found
    if (!user) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
        {
          description: 'username not found',
        },
      );
    }

    // deactivated account
    if (!user.status) {
      throw new HttpException(
        'This account has been deactivated',
        HttpStatus.UNAUTHORIZED,
        {
          description: 'deactivated account',
        },
      );
    }

    // authenticated
    if (user.username == username && user.password == password) {
      // reset login attempt
      user.loginAttempt = 0;
      this.usersService.update(user);

      return user;
      // wrong credential
    } else {
      this.checkLoginAttempt(user);
      // increment login attempt
      user.loginAttempt += 1;
      this.usersService.update(user);
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
        {
          description: 'wrong password',
        },
      );
    }
  }

  private checkLoginAttempt(user: User) {
    if (user.loginAttempt == 3) {
      user.loginAttempt = 0;
      this.usersService.update(user);
      this.usersService.toggleStatus(user.userId);
      throw new HttpException(
        'Too many login attempts. Account deactivated',
        HttpStatus.UNAUTHORIZED,
        {
          description: 'brute force detected',
        },
      );
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
