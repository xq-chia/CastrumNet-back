import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UsersService } from './../users/users.service';

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private JwtService: JwtService) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.username }
        // TODO: Generate a JWT and return it here
        // instead of the user object
        return {
          accss_token: await this.JwtService.signAsync(payload)
        };
      }
}
