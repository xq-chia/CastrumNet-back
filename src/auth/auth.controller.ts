import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from '../dto/signIn-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SignInDto) {
        let res = {
            msg: 'ok',
            user: {
                token: await this.authService.signIn(signInDto.username, signInDto.password),
                name: signInDto.username,
                email: `${signInDto.username}@mail.com`,
                id: 1000,
                time: new Date().getTime()
            }
        }
        return res;
    }
}
