import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost } from '@nestjs/common/interfaces';
import { WriteStream, access, createWriteStream, exists, fstat, write, writeFile } from 'fs';
import { constants } from 'fs/promises';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AccountingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getClass().name.endsWith('Controller')) {
      let req: any;

      req = context.switchToHttp().getRequest();
      let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
      let method = req.method;
      let url = req.path;
      let query = JSON.stringify(req.query);
      let body = JSON.stringify(req.body);
      let params = JSON.stringify(req.params);
      let token = req.get('authorization') ? req.get('authorization').split(' ')[1] : null;

      let line = `[REQ] ${time} ${method} ${url} ${query} ${body} ${params} ${token}`;

      this.log(line)
    } else {
      let ws: WsArgumentsHost;

      ws = context.switchToWs();

      console.log(JSON.stringify(ws.getData()))
      console.log()
    }

    return next.handle().pipe(
      tap(res => {
        if (res) {
          this.log('[RES] ACCEPTED')
        } else {
          this.log('[RES] REJECTED')
        }
      })
    );
  }

  log(line: String) {
    let stream: WriteStream;
    let date = new Date().toISOString().split('T')[0]
    let path = `/home/zachia-dev/fyp/log/${date}.log`
    stream = createWriteStream(path, { flags: 'a+' });

    stream.write(line);
    stream.end('\n')
  }
}
