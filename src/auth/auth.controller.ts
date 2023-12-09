import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { LoginDto } from '../dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    let res: any;
    let token: string;

      token = await this.authService.login(loginDto.username, loginDto.password);

      let user: User;
      let time: number;

      user = await this.usersService.findOneByUsername(loginDto.username);
      time = new Date().getTime();

      res = {
        msg: `Authenticated. Welcome back ${user.firstName}`,
        user: {
          token: token,
          name: user.firstName + ' ' + user.lastName,
          email: user.username,
          id: user.userId,
          time: time,
          expired: time + 1000 * 60 * 5,
        },
      };

      return res;
  }
}
