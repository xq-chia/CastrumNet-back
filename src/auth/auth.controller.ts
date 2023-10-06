import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const res = {
      msg: 'ok',
      user: {
        token: await this.authService.login(
          loginDto.username,
          loginDto.password,
        ),
        name: loginDto.username,
        email: `${loginDto.username}@mail.com`,
        id: 1000,
        time: new Date().getTime(),
      },
    };
    return res;
  }
}
