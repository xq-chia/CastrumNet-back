import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WriteStream, createWriteStream } from 'fs';
import { Observable, catchError, tap } from 'rxjs';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountingInterceptor implements NestInterceptor {
  constructor(
    private loggerSrv: LoggerService,
    private jwtSrv: JwtService,
    private userService: UsersService
    ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let req: any;

    req = context.switchToHttp().getRequest();

    let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', });
    let method = req.method;
    let url = req.path;
    let query = JSON.stringify(req.query);
    let body = JSON.stringify(req.body);
    let params = JSON.stringify(req.params);
    let token = req.get('token') ? req.get('token') : null;
    let clearToken = this.jwtSrv.decode(token);
    let userId = parseInt(clearToken.sub)
    let username = (await this.userService.findOneById(userId)).username;

    let line = `[REQ] ${time} ${method} ${url} ${query} ${body} ${params} ${username}`;

    this.loggerSrv.logHttp(line)

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.loggerSrv.logHttp(`[RES] ACCEPTED ${JSON.stringify(data)}`);
        },
        error: (err) => {
          this.loggerSrv.logHttp(`[RES] REJECTED ${err.status} ${err.message} ${err.options.description}`);
        }
      })
    );
  }
  
}
