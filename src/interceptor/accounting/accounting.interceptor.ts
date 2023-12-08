import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, } from '@nestjs/common';
import { WriteStream, createWriteStream } from 'fs';
import { Observable, catchError, tap } from 'rxjs';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AccountingInterceptor implements NestInterceptor {
  constructor(private loggerSrv: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let req: any;

    req = context.switchToHttp().getRequest();

    let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', });
    let method = req.method;
    let url = req.path;
    let query = JSON.stringify(req.query);
    let body = JSON.stringify(req.body);
    let params = JSON.stringify(req.params);
    let token = req.get('authorization') ? req.get('authorization').split(' ')[1] : null;

    let line = `[REQ] ${time} ${method} ${url} ${query} ${body} ${params} ${token}`;

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
